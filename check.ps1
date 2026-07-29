Add-Type -AssemblyName System.Drawing
$bg = [System.Drawing.Image]::FromFile('C:\Users\Asus\.gemini\antigravity-ide\brain\3ac6e215-82e0-4f31-ada8-831f49b37e5d\hero_bg_clean_1785237030239.png')
$logo = [System.Drawing.Image]::FromFile('public\images\butterfly-logo-transparent.png')
Write-Output "BG: $($bg.Width)x$($bg.Height)"
Write-Output "Logo: $($logo.Width)x$($logo.Height)"
$bg.Dispose()
$logo.Dispose()
