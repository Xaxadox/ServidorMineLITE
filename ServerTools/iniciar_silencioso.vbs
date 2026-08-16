Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run "cmd /c cd """ & strPath & "\backend"" && npm start", 0, False
WshShell.Run "cmd /c cd """ & strPath & "\frontend"" && npm run dev -- --port 5174", 0, False
WshShell.Run "cmd /c timeout /t 3 > nul && start http://localhost:5174", 0, False
