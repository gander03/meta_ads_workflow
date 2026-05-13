cd %cd%
start run_frontend.bat
cd %cd%scripts
py -m flask --app scripts/api run -p 5757


