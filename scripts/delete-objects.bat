@echo off
setlocal

REM Check if DeleteMarkers[] is present
aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query "DeleteMarkers" > nul 2>&1
if %errorlevel% equ 0 (
    echo DeleteMarkers[] found, executing delete-objects for DeleteMarkers
    for /f "usebackq tokens=1,2" %%i in (`aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query "DeleteMarkers[].{Key:Key,VersionId:VersionId}" --output text`) do (
        echo Deleting object with Key=%%i and VersionId=%%j
        aws s3api delete-object --bucket v2-angularjs-boilerplate --key "%%i" --version-id "%%j"
    )
)

REM Check if Versions[] is present
aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query "Versions" > nul 2>&1
if %errorlevel% equ 0 (
    echo Versions[] found, executing delete-objects for Versions
    for /f "usebackq tokens=1,2" %%i in (`aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query "Versions[].{Key:Key,VersionId:VersionId}" --output text`) do (
        echo Deleting object with Key=%%i and VersionId=%%j
        aws s3api delete-object --bucket v2-angularjs-boilerplate --key "%%i" --version-id "%%j"
    )
)

endlocal





@REM -------------------------------------
@REM # #!/bin/bash



@REM # # Check if DeleteMarkers[] is present
@REM # echo "Starting delete script"

@REM # if aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query 'DeleteMarkers' >/dev/null 2>&1; then
@REM #     echo "DeleteMarkers[] found, executing delete-objects for DeleteMarkers"
@REM #     aws s3api delete-objects --bucket v2-angularjs-boilerplate --delete "$(aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query='{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}')"
@REM # fi

@REM # # Check if Versions[] is present
@REM # if aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query 'Versions' >/dev/null 2>&1; then
@REM #     echo "Versions[] found, executing delete-objects for Versions"
@REM #     aws s3api delete-objects --bucket v2-angularjs-boilerplate --delete "$(aws s3api list-object-versions --bucket v2-angularjs-boilerplate --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}')"
@REM # fi