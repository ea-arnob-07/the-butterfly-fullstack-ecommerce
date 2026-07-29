Add-Type -AssemblyName System.Drawing
$bgPath = 'C:\Users\Asus\.gemini\antigravity-ide\brain\3ac6e215-82e0-4f31-ada8-831f49b37e5d\hero_bg_clean_1785237030239.png'
$logoPath = 'public\images\butterfly-logo-transparent.png'
$outPath = 'public\images\butterfly-hero-4k.png'

$bg = [System.Drawing.Image]::FromFile($bgPath)
$logo = [System.Drawing.Image]::FromFile($logoPath)

$newBg = new-object System.Drawing.Bitmap($bg.Width, $bg.Height)
$g = [System.Drawing.Graphics]::FromImage($newBg)

# Draw background
$g.DrawImage($bg, 0, 0, $bg.Width, $bg.Height)

# Calculate logo size and position
$logoWidth = 420
$logoHeight = [int]($logo.Height * ($logoWidth / $logo.Width))
$x = 550
$y = [int](($bg.Height - $logoHeight) / 2)

# Draw logo
$g.DrawImage($logo, $x, $y, $logoWidth, $logoHeight)

# Save
$newBg.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$newBg.Dispose()
$bg.Dispose()
$logo.Dispose()

Write-Output "Image composited successfully!"
