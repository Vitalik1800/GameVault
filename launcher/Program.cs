using System.Diagnostics;
using System.IO;
using System.Net.Http;

string launcherDirectory = AppContext.BaseDirectory;

string? projectDirectory = Directory.GetParent(launcherDirectory)?.FullName;

while (projectDirectory != null)
{
    string serverCandidate = Path.Combine(
        projectDirectory,
        "src",
        "server.js"
    );

    if (File.Exists(serverCandidate))
    {
        break;
    }

    projectDirectory = Directory.GetParent(projectDirectory)?.FullName;
}

if (projectDirectory == null)
{
    Console.WriteLine("Error: GameVault project directory was not found.");
    Console.ReadKey();
    return;
}

string nodePath = Path.Combine(
    launcherDirectory,
    "node.exe"
);

string serverPath = Path.Combine(
    projectDirectory,
    "src",
    "server.js"
);

if (!File.Exists(nodePath))
{
    Console.WriteLine("Error: node.exe was not found.");
    Console.WriteLine($"Expected: {nodePath}");
    Console.ReadKey();
    return;
}

if (!File.Exists(serverPath))
{
    Console.WriteLine("Error: server.js was not found.");
    Console.WriteLine($"Expected: {serverPath}");
    Console.ReadKey();
    return;
}

var processStartInfo = new ProcessStartInfo
{
    FileName = nodePath,
    Arguments = $"\"{serverPath}\"",
    WorkingDirectory = projectDirectory,
    UseShellExecute = false,
    CreateNoWindow = false
};

using var serverProcess = Process.Start(processStartInfo);

if (serverProcess == null)
{
    Console.WriteLine("Error: failed to start GameVault server.");
    Console.ReadKey();
    return;
}

Console.WriteLine("GameVault server is starting...");
Console.WriteLine("Waiting for the server to become ready...");

using var httpClient = new HttpClient
{
    Timeout = TimeSpan.FromSeconds(1)
};

bool serverReady = false;

for (int attempt = 0; attempt < 60; attempt++)
{
    if (serverProcess.HasExited)
    {
        Console.WriteLine("Error: GameVault server stopped unexpectedly.");
        Console.ReadKey();
        return;
    }

    try
    {
        using var response = await httpClient.GetAsync(
            "http://localhost:3000/api/health"
        );

        if (response.IsSuccessStatusCode)
        {
            serverReady = true;
            break;
        }
    }
    catch
    {
        // Server is not ready yet.
    }

    await Task.Delay(200);
}

if (!serverReady)
{
    Console.WriteLine("Error: GameVault server did not become ready.");
    Console.ReadKey();
    return;
}

Console.WriteLine("GameVault server is ready.");

string chromePath = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
    "Google",
    "Chrome",
    "Application",
    "chrome.exe"
);

string chromePathX86 = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86),
    "Google",
    "Chrome",
    "Application",
    "chrome.exe"
);

if (!File.Exists(chromePath))
{
    chromePath = chromePathX86;
}

if (!File.Exists(chromePath))
{
    Console.WriteLine("Error: Google Chrome was not found.");
    Console.WriteLine("Please install Google Chrome.");
    
    serverProcess.Kill(true);
    Console.ReadKey();
    return;
}

string appProfileDirectory = Path.Combine(
    Path.GetTempPath(),
    "GameVaultChrome"
);

if (Directory.Exists(appProfileDirectory))
{
    try
    {
        Directory.Delete(appProfileDirectory, true);
    }
    catch
    {
        // Ignore cleanup errors.
    }
}

Directory.CreateDirectory(appProfileDirectory);

Console.WriteLine("Opening GameVault...");

var browserStartInfo = new ProcessStartInfo
{
    FileName = chromePath,
    Arguments =
        $"--app=http://localhost:3000 " +
        $"--user-data-dir=\"{appProfileDirectory}\" " +
        "--no-first-run " +
        "--no-default-browser-check",
    WorkingDirectory = projectDirectory,
    UseShellExecute = false
};

using var browserProcess = Process.Start(browserStartInfo);

if (browserProcess == null)
{
    Console.WriteLine("Error: failed to start GameVault window.");
    serverProcess.Kill(true);
    Console.ReadKey();
    return;
}

Console.WriteLine("GameVault is running.");
Console.WriteLine("Close the GameVault window to exit.");

await browserProcess.WaitForExitAsync();

Console.WriteLine("GameVault window closed.");
Console.WriteLine("Stopping GameVault server...");

if (!serverProcess.HasExited)
{
    serverProcess.Kill(true);
    await serverProcess.WaitForExitAsync();
}

try
{
    Directory.Delete(appProfileDirectory, true);
}
catch
{
    // Ignore cleanup errors.
}

Console.WriteLine("GameVault closed.");