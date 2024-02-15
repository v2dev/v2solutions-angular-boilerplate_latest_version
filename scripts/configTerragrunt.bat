@echo off
setlocal enabledelayedexpansion

set "search=%1"
set "replace=%2"
set "workspace=%3"

cd %workspace%

for /r %%i in (*.hcl) do (
    set "input_file=%%i"
    set "output_file=!input_file:.hcl=_modified.hcl!"

    ( 
        for /f "tokens=*" %%j in (!input_file!) do (
            set "line=%%j"
            set "line=!line:%search%=%replace%!"
            echo !line!>>!output_file!
        )
    )

    move /y !output_file! !input_file!
)

echo Done