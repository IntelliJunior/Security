# SecurityApp -- Build & Installer Guide

This guide explains how to:

-   Rebuild the Spring Boot project
-   Generate the executable `.exe`
-   Install and run the application

------------------------------------------------------------------------

## 🛠️ Prerequisites

Make sure you have:

-   Java 21 installed\

-   Gradle installed (or use `gradlew`)\

-   WiX Toolset 3.11 installed\

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

------------------------------------------------------------------------

## ⚙️ Step 2 -- Update application.properties

Add:

``` properties
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

------------------------------------------------------------------------

## 🔨 Step 3 -- Rebuild Project

From project root:

    ./gradlew clean bootJar

Verify jar exists:

    dir build\libs

------------------------------------------------------------------------

## 🏗️ Step 4 -- Create Windows Installer (.exe)

Run:


Below is a production / enterprise-grade jpackage command with:

✅ Custom icon
✅ No console window
✅ Vendor name
✅ Versioned installer
✅ Upgrade support
✅ Per-user install (no admin required)
✅ Start menu + Desktop shortcut
✅ Install directory chooser

🏢 Enterprise-Grade One-Liner
jpackage --type exe --input build/libs --name NNSSApp --main-jar security-0.0.1-SNAPSHOT.jar --dest dist --app-version 1.0.0 --vendor "NEW NATIONAL SECURITY SERVICES" --description "NEW NATIONAL SECURITY SERVICES Management System" --copyright "Copyright 2026 NEW NATIONAL SECURITY SERVICES" --icon src/main/resources/icon.ico --win-menu --win-shortcut --win-dir-chooser --win-per-user-install --win-console --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc


🔥 What Each Enterprise Flag Does
🎨 Custom Icon
--icon src/main/resources/icon.ico


✔ Must be .ico file
✔ 256x256 recommended

🏢 Vendor Branding
--vendor "NNSS Technologies Pvt Ltd"


Shows in:

Control Panel

Installer

Uninstall section

📦 Upgrade Support (VERY IMPORTANT)
--win-upgrade-uuid 12345678-1234-1234-1234-123456789abc


✔ Keeps same UUID forever
✔ Allows seamless upgrades
✔ Prevents duplicate installations

⚠️ Never change this UUID for future versions.

To generate your own UUID:

uuidgen

🖥 No Console Window

Since you did NOT include:

--win-console


✔ App runs silently
✔ No black CMD window

🚀 Future Upgrade Command (Example v1.1.0)
jpackage --type exe --input build/libs --name NNSSApp --main-jar security-0.0.1-SNAPSHOT.jar --dest dist --app-version 1.1.0 --vendor "NNSS Technologies Pvt Ltd" --description "NNSS Security Management System" --copyright "Copyright 2026 NNSS Technologies" --icon src/main/resources/icon.ico --win-menu --win-shortcut --win-dir-chooser --win-per-user-install --win-upgrade-uuid 12345678-1234-1234-1234-123456789abc


Just change:

--app-version


Installer will automatically:

Detect old version

Upgrade it

Keep user data

🏆 True Enterprise Checklist

Before building:

✔ gradlew clean bootJar

✔ Confirm jar exists in build/libs

✔ Confirm icon file exists

✔ Use SAME upgrade UUID forever

✔ WiX installed (v3.11)

Installer will be created inside:

    dist\SecurityApp-1.0.0.exe

------------------------------------------------------------------------

## 💻 Step 5 -- Install Application

1.  Open `dist` folder\
2.  Double-click `SecurityApp-1.0.0.exe`\
3.  Click:
    -   Next\
    -   Install\
    -   Finish

If Windows SmartScreen appears: - Click **More info** - Click **Run
anyway**

------------------------------------------------------------------------

## 🚀 Step 6 -- Run Application

After installation:

-   Use Desktop shortcut\
    OR\
-   Open from Start Menu → SecurityApp

Then open browser:

    http://localhost:8888
Username:admin@example.com
Password:admin123
------------------------------------------------------------------------

## 🔄 Rebuilding After Changes

Whenever you modify code or configuration:

    gradlew clean bootJar
    jpackage ...

Then reinstall using the new `.exe`.

------------------------------------------------------------------------

## 📦 Production Notes

-   Installer includes bundled Java runtime
-   No system Java required
-   Admin user auto-created on first startup
-   Safe for internal distribution
