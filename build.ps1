function GetBase64 {
    param (
        [string] $Path
    )
    $ByteArray = Get-Content -Path $Path -AsByteStream -Raw
    return [Convert]::ToBase64String($ByteArray)
}

function ReplaceFile {
    param (
        [string] $Target,
        [string] $From,
        [string] $To
    )
    $Content = Get-Content -Path $Target -Encoding utf8NoBOM -Raw
    $ContentNew = $Content -replace $From,$To
    Set-Content -Path $Target -Encoding utf8NoBOM -Value $ContentNew
}

# 编译sdk
yarn build

if ($?) {
    # 编译wasm-audio
    Push-Location -Path 'C:\Workspace\Rust\wasm-audio'
    wasm-pack build --target no-modules --release
    Pop-Location
    
    # wasm_audio.js内容 添加到AudioProcessor.js
    Copy-Item -Force -Path '.\AudioProcessor.js' -Destination '.\dist'
    $Content = Get-Content -Path "C:\Workspace\Rust\wasm-audio\pkg\wasm_audio.js" -Encoding utf8NoBOM -Raw
    ReplaceFile -Target '.\dist\AudioProcessor.js' -From '// wasm_audio.js' -To $Content

    # 设置index.js audioProcessorBase64的内容
    $B64 = GetBase64 -Path '.\dist\AudioProcessor.js'
    ReplaceFile -Target '.\dist\index.js' -From "const audioProcessorBase64 = '';" -To "const audioProcessorBase64 = '$($B64)';"
    Remove-Item -Force '.\dist\AudioProcessor.js'
    
    # 设置index.js wasmBytesBase64的内容
    $B64 = GetBase64 -Path "C:\Workspace\Rust\wasm-audio\pkg\wasm_audio_bg.wasm"
    ReplaceFile -Target '.\dist\index.js' -From "const wasmBytesBase64 = '';" -To "const wasmBytesBase64 = '$($B64)';"
}
