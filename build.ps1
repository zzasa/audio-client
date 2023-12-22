yarn build
if ($?) {
    $ByteArray = Get-Content -Path .\AudioProcessor.js -AsByteStream -Raw
    $B64=[Convert]::ToBase64String($ByteArray)
    $IndexContent = Get-Content -Path .\dist\index.js -Encoding utf8NoBOM -Raw
    $IndexContextNew = $IndexContent -replace "const audioProcessorBase64 = '';","const audioProcessorBase64 = '$($B64)';"
    Set-Content -Path .\dist\index.js -Encoding utf8NoBOM -Value $IndexContextNew
}
