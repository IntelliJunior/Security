
# SecurityApp -- Build & Installer Guide

This guide explains how to:

-   Rebuild the Spring Boot project
-   Generate the executable `.exe`
-   Install and run the application (with a visible console window showing logs)

------------------------------------------------------------------------

## 🛠️ Prerequisites

Make sure you have:

-   Java 21 installed

-   Gradle installed (the project's bundled `gradlew.bat` works too — no separate Gradle install needed)

-   WiX Toolset 3.11 installed

-   WiX added to PATH:

        C:\Program Files (x86)\WiX Toolset v3.11\bin

Verify WiX installation:

    candle
    light

------------------------------------------------------------------------

## 📂 Step 1 -- Add Admin Insert Script

Create:

    src/main/resources/data.sql

Add:

``` sql
INSERT INTO ADMINS (ID, CREATED_AT, EMAIL, PASSWORD, ROLE, USERNAME)
SELECT 1, CURRENT_TIMESTAMP, 'admin@example.com',
       '$2a$10$iYRlcKgJH6wKhM.mPGD75eqT9yHeVHs4RCNwP9eV9LDgeFoAOIL1O',
       'ADMIN', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM ADMINS WHERE USERNAME = 'admin'
);
```

> ⚠️ **Verify this hash before relying on it.** The guide documents the login
> password as `admin123` in Step 6. Confirm the bcrypt hash above actually
> encodes `admin123` (e.g. with a small Spring Boot `BCryptPasswordEncoder`
> test, or `htpasswd -bnBC 10 "" admin123`) before shipping this to anyone —
> otherwise the documented credentials won't work on first login.

------------------------------------------------------------------------

## ⚙️ Step 2 -- Update application.properties

Add:

``` properties
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

------------------------------------------------------------------------

## 🔨 Step 3 -- Rebuild Project

From project root (Windows):

    gradlew.bat clean bootJar

Verify jar exists:

    dir build\libs

------------------------------------------------------------------------

## 🏗️ Step 4 -- Create Windows Installer (.exe)

Below is the production/enterprise-grade `jpackage` command with:

✅ Custom icon
✅ **Visible console window with live logs**
✅ Vendor name
✅ Versioned installer
✅ Upgrade support
✅ Per-user install (no admin required)
✅ Start menu + Desktop shortcut
✅ Install directory chooser

### 🏢 Enterprise-Grade One-Liner

```
jpackage --type exe --input build/libs --name SecurityApp --main-jar security-0.0.1-SNAPSHOT.jar --dest dist --app-version 1.0.0 --vendor "NEW NATIONAL SECURITY SERVICES" --description "NEW NATIONAL SECURITY SERVICES Management System" --copyright "Copyright 2026 NEW NATIONAL SECURITY SERVICES" --icon src/main/resources/icon.ico --win-menu --win-shortcut --win-dir-chooser --win-per-user-install --win-console --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc
```

### 🔥 What Each Enterprise Flag Does

**🎨 Custom Icon**

    --icon src/main/resources/icon.ico

✔ Must be a `.ico` file
✔ 256x256 recommended

**🏢 Vendor Branding**

    --vendor "NEW NATIONAL SECURITY SERVICES"

Shows in:
- Control Panel
- Installer
- Uninstall section

**📦 Upgrade Support (VERY IMPORTANT)**

    --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc

✔ Keeps the same UUID forever
✔ Allows seamless upgrades
✔ Prevents duplicate installations

⚠️ **Never change this UUID for future versions.**

To generate your own UUID:

    uuidgen

**🖥 Console Window Visible (as requested)**

    --win-console

✔ Launches a console/terminal window alongside the app
✔ Shows live Spring Boot logs while the application is running
✔ Close the console window to stop the application

If you ever want a silent background app instead, just drop this flag —
but since you want to watch the logs, keep it in.

### 🚀 Future Upgrade Command (Example v1.1.0)

```
jpackage --type exe --input build/libs --name SecurityApp --main-jar security-0.0.1-SNAPSHOT.jar --dest dist --app-version 1.1.0 --vendor "NEW NATIONAL SECURITY SERVICES" --description "NEW NATIONAL SECURITY SERVICES Management System" --copyright "Copyright 2026 NEW NATIONAL SECURITY SERVICES" --icon src/main/resources/icon.ico --win-menu --win-shortcut --win-dir-chooser --win-per-user-install --win-console --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc
```

Just change:

    --app-version

The installer will automatically:
- Detect the old version
- Upgrade it
- Keep user data

### 🏆 True Enterprise Checklist

Before building:

✔ `gradlew.bat clean bootJar`
✔ Confirm the jar exists in `build\libs`
✔ Confirm the icon file exists
✔ Use the **same** `--win-upgrade-uuid` forever
✔ WiX installed (v3.11)
✔ Confirm `--name` matches what you expect in Start Menu / shortcuts (`SecurityApp`)

The installer will be created inside:

    dist\SecurityApp-1.0.0.exe

------------------------------------------------------------------------

## 💻 Step 5 -- Install Application

1.  Open the `dist` folder
2.  Double-click `SecurityApp-1.0.0.exe`
3.  Click:
    -   Next
    -   Install
    -   Finish

If Windows SmartScreen appears:
-   Click **More info**
-   Click **Run anyway**

------------------------------------------------------------------------

## 🚀 Step 6 -- Run Application

After installation:

-   Use the Desktop shortcut
    OR
-   Open from Start Menu → SecurityApp

A console window will open and stay open, streaming the application logs.
Leave it running in the background while you use the app; closing it will
stop the application.

Then open your browser to:

    http://localhost:8888

Login:

    Username: admin@example.com
    Password: admin123

------------------------------------------------------------------------

## 🔄 Rebuilding After Changes

Whenever you modify code or configuration:

    gradlew.bat clean bootJar
    jpackage --type exe --input build/libs --name SecurityApp --main-jar security-0.0.1-SNAPSHOT.jar --dest dist --app-version <new-version> --vendor "NEW NATIONAL SECURITY SERVICES" --description "NEW NATIONAL SECURITY SERVICES Management System" --copyright "Copyright 2026 NEW NATIONAL SECURITY SERVICES" --icon src/main/resources/icon.ico --win-menu --win-shortcut --win-dir-chooser --win-per-user-install --win-console --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc

Then reinstall using the new `.exe`.

------------------------------------------------------------------------

## 📦 Production Notes

-   Installer includes a bundled Java runtime — no system Java required on the target machine
-   Admin user auto-created on first startup (verify the password hash as noted in Step 1)
-   Console window stays open and shows live logs while the app runs
-   Safe for internal distribution
