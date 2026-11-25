Add-Type -AssemblyName System.Drawing

$videoItems = @(
    @{ file="childhood_video_01_poster.jpg"; mp4="childhood_video_01.mp4"; tag="CHILDHOOD CLIP"; title="First Birthday Laughter"; dur="0:45"; bg1="#6b091f"; bg2="#36030e" },
    @{ file="childhood_video_02_poster.jpg"; mp4="childhood_video_02.mp4"; tag="CHILDHOOD CLIP"; title="Dance in the Living Room"; dur="1:12"; bg1="#7a0c23"; bg2="#4c0515" },
    @{ file="school_video_01_poster.jpg"; mp4="school_video_01.mp4"; tag="SCHOOL DAYS CLIP"; title="School Picnic Shenanigans"; dur="2:05"; bg1="#8b112d"; bg2="#5a071a" },
    @{ file="school_video_02_poster.jpg"; mp4="school_video_02.mp4"; tag="SCHOOL DAYS CLIP"; title="Farewell Day Memories"; dur="1:48"; bg1="#5a071a"; bg2="#2b020b" },
    @{ file="special_moment_01_poster.jpg"; mp4="special_moment_01.mp4"; tag="SPECIAL MOMENT"; title="Surprise Celebration Moment"; dur="1:30"; bg1="#7a0c23"; bg2="#38030e" },
    @{ file="special_moment_02_poster.jpg"; mp4="special_moment_02.mp4"; tag="SPECIAL MOMENT"; title="Midnight Cake and Fireworks"; dur="0:58"; bg1="#96132f"; bg2="#4c0515" }
)

foreach ($item in $videoItems) {
    $bmp = [System.Drawing.Bitmap]::new(800, 500)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $c1 = [System.Drawing.ColorTranslator]::FromHtml($item.bg1)
    $c2 = [System.Drawing.ColorTranslator]::FromHtml($item.bg2)

    # Deep velvet cherry background gradient
    $rect = [System.Drawing.Rectangle]::new(0, 0, 800, 500)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    # Film strip border top and bottom
    $filmBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 25, 2, 8))
    $g.FillRectangle($filmBrush, 0, 0, 800, 42)
    $g.FillRectangle($filmBrush, 0, 458, 800, 42)
    $filmBrush.Dispose()

    # Film sprocket holes (warm cream)
    $holeBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#fffdf8"))
    for ($x = 20; $x -lt 800; $x += 40) {
        $g.FillRectangle($holeBrush, $x, 10, 20, 22)
        $g.FillRectangle($holeBrush, $x, 468, 20, 22)
    }
    $holeBrush.Dispose()

    # Center play circle in gold & cream
    $playCircleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(235, 255, 253, 250))
    $g.FillEllipse($playCircleBrush, 350, 180, 100, 100)
    $playCircleBrush.Dispose()

    $goldRingPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml("#d4af37"), 3)
    $g.DrawEllipse($goldRingPen, 350, 180, 100, 100)
    $goldRingPen.Dispose()

    # Play triangle in Deep Cherry Red
    $playTriBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#7a0c23"))
    $p1 = [System.Drawing.Point]::new(390, 210)
    $p2 = [System.Drawing.Point]::new(430, 230)
    $p3 = [System.Drawing.Point]::new(390, 250)
    [System.Drawing.Point[]]$pts = @($p1, $p2, $p3)
    $g.FillPolygon($playTriBrush, $pts)
    $playTriBrush.Dispose()

    # Fonts
    $fontTag = [System.Drawing.Font]::new("Arial", 12, [System.Drawing.FontStyle]::Bold)
    $fontTitle = [System.Drawing.Font]::new("Georgia", 22, [System.Drawing.FontStyle]::Bold)
    $fontSub = [System.Drawing.Font]::new("Georgia", 14, [System.Drawing.FontStyle]::Italic)
    $fontDur = [System.Drawing.Font]::new("Arial", 12, [System.Drawing.FontStyle]::Bold)

    $formatCenter = [System.Drawing.StringFormat]::new()
    $formatCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $formatCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#f3e5ab"))

    $g.DrawString("VIDEO MEMORY CLIP: $($item.tag)", $fontTag, $goldBrush, 400, 80, $formatCenter)
    $g.DrawString($item.title, $fontTitle, $whiteBrush, 400, 130, $formatCenter)
    $g.DrawString("Duration: $($item.dur) - Tap or Click to Play", $fontDur, $goldBrush, 400, 310, $formatCenter)
    $g.DrawString("Replace with: assets/videos/$($item.mp4)", $fontSub, $whiteBrush, 400, 390, $formatCenter)

    # Cleanup
    $fontTag.Dispose()
    $fontTitle.Dispose()
    $fontSub.Dispose()
    $fontDur.Dispose()
    $whiteBrush.Dispose()
    $goldBrush.Dispose()
    $g.Dispose()

    $posterPath = Join-Path "assets\images" $item.file
    $bmp.Save($posterPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Regenerated Cherry Red Poster: $posterPath"
}
