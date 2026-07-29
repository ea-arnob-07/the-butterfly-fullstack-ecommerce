$envFile = ".env"
Get-Content $envFile | Where-Object { $_ -match '^\s*([^#=]+)=(.*)$' } | ForEach-Object {
    $key = $matches[1].Trim()
    $val = $matches[2].Trim()
    
    if ($val -match '^"(.*)"$') {
        $val = $matches[1]
    }
    
    if ($key -eq "NEXT_PUBLIC_SITE_URL") {
        return
    }
    
    Write-Host "Adding $key ..."
    & npx vercel env rm $key "production,preview" -y *>$null
    $val | & npx vercel env add $key "production,preview"
}
Write-Host "All env vars added."
