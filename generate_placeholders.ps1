Add-Type -AssemblyName System.Drawing

$items = @(
    @{ file="childhood_01.jpg"; tag="CHILDHOOD"; title="Tiny Steps and Big Dreams"; sub="Age 2 - Sweet Beginnings"; motif="BABY DAYS"; bg1="#fdfbf7"; bg2="#f4eae4"; stroke="#7a0c23"; badgeBg="#5a071a" },
    @{ file="childhood_02.jpg"; tag="CHILDHOOD"; title="Little Garden Explorer"; sub="Age 4 - Chasing Butterflies"; motif="WONDER"; bg1="#fcf8f5"; bg2="#eeded8"; stroke="#8b112d"; badgeBg="#4c0515" },
    @{ file="childhood_03.jpg"; tag="CHILDHOOD"; title="Birthday Cake Smile"; sub="Cuteness Overload and Joy"; motif="JOY"; bg1="#fffdfa"; bg2="#f2e2dc"; stroke="#6b091f"; badgeBg="#5a071a" },
    @{ file="childhood_04.jpg"; tag="CHILDHOOD"; title="Silly Faces and Giggles"; sub="Carefree Days and Innocence"; motif="LAUGHTER"; bg1="#fbf7f2"; bg2="#eddcd6"; stroke="#7a0c23"; badgeBg="#6b091f" },
    @{ file="childhood_05.jpg"; tag="CHILDHOOD"; title="Cozy Naps and Warm Hugs"; sub="Sweet Lullabies and Warmth"; motif="SWEET"; bg1="#fdfbf8"; bg2="#efe3dc"; stroke="#5a071a"; badgeBg="#4c0515" },

    @{ file="school_memory_01.jpg"; tag="SCHOOL DAYS"; title="First Day of School"; sub="Uniforms, New Bags and Friends"; motif="NEW CHAPTER"; bg1="#fbf8f4"; bg2="#ede0d8"; stroke="#7a0c23"; badgeBg="#5a071a" },
    @{ file="school_memory_02.jpg"; tag="SCHOOL DAYS"; title="Lunch Break Laughs"; sub="Sharing Tiffins and Stories"; motif="BESTIES"; bg1="#fdfaf6"; bg2="#ebdcd4"; stroke="#8b112d"; badgeBg="#6b091f" },
    @{ file="school_memory_03.jpg"; tag="SCHOOL DAYS"; title="Annual Day Spotlight"; sub="Stage Confidence and Applause"; motif="SHINE"; bg1="#fcf8f5"; bg2="#eedfd8"; stroke="#5a071a"; badgeBg="#4c0515" },
    @{ file="school_memory_04.jpg"; tag="SCHOOL DAYS"; title="Exam Season Group Study"; sub="Notes, Revision and Coffee"; motif="FOCUS"; bg1="#faf6f2"; bg2="#ebddd6"; stroke="#7a0c23"; badgeBg="#5a071a" },
    @{ file="school_memory_05.jpg"; tag="SCHOOL DAYS"; title="Last Bench Chronicles"; sub="Secret Whispers and Inside Jokes"; motif="MEMORIES"; bg1="#fdfbf8"; bg2="#ede1da"; stroke="#6b091f"; badgeBg="#4c0515" },

    @{ file="special_memory_01.jpg"; tag="SPECIAL MOMENTS"; title="Golden Hour Smiles"; sub="Sunset Glow and Pure Happiness"; motif="GOLDEN"; bg1="#fffcf7"; bg2="#f3e5d8"; stroke="#8b112d"; badgeBg="#5a071a" },
    @{ file="special_memory_02.jpg"; tag="SPECIAL MOMENTS"; title="Heart-to-Heart Talks"; sub="Late Night Talks and True Bond"; motif="BOND"; bg1="#fcf8f5"; bg2="#ebdcd5"; stroke="#5a071a"; badgeBg="#4c0515" },
    @{ file="special_memory_03.jpg"; tag="SPECIAL MOMENTS"; title="Festival Sparkles"; sub="Festive Lights and Traditional Elegance"; motif="ELEGANCE"; bg1="#fffdf9"; bg2="#f2e2d8"; stroke="#7a0c23"; badgeBg="#6b091f" },
    @{ file="special_memory_04.jpg"; tag="SPECIAL MOMENTS"; title="Candid Polaroids"; sub="Trips, Adventures and Laughs"; motif="ADVENTURE"; bg1="#fbf7f2"; bg2="#ecded7"; stroke="#8b112d"; badgeBg="#5a071a" },
    @{ file="special_memory_05.jpg"; tag="SPECIAL MOMENTS"; title="Celebrating You"; sub="A Friend Like No Other - True Gem"; motif="PRANJAL"; bg1="#fdfbf8"; bg2="#efe3dc"; stroke="#5a071a"; badgeBg="#4c0515" }
)

foreach ($item in $items) {
    $bmp = [System.Drawing.Bitmap]::new(800, 800)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $c1 = [System.Drawing.ColorTranslator]::FromHtml($item.bg1)
    $c2 = [System.Drawing.ColorTranslator]::FromHtml($item.bg2)
    $cStroke = [System.Drawing.ColorTranslator]::FromHtml($item.stroke)
    $cBadge = [System.Drawing.ColorTranslator]::FromHtml($item.badgeBg)

    # Warm cream gradient backdrop
    $rect = [System.Drawing.Rectangle]::new(0, 0, 800, 800)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $g.FillRectangle($brush, $rect)
    $brush.Dispose()

    # Inner polaroid card frame (warm parchment)
    $cardRect = [System.Drawing.Rectangle]::new(50, 50, 700, 700)
    $cardBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 253, 250))
    $g.FillRectangle($cardBrush, $cardRect)
    $cardBrush.Dispose()

    # Double Cherry Red border
    $pen = [System.Drawing.Pen]::new($cStroke, 4)
    $g.DrawRectangle($pen, 60, 60, 680, 680)
    $pen.Color = [System.Drawing.ColorTranslator]::FromHtml("#d4af37") # Gold accent inner line
    $pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $pen.Width = 2
    $g.DrawRectangle($pen, 70, 70, 660, 660)
    $pen.Dispose()

    # Cherry Red Tape sticker at top center
    $tapeBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(210, 122, 12, 35))
    $g.FillRectangle($tapeBrush, 310, 35, 180, 35)
    $tapeBrush.Dispose()

    # Fonts
    $fontFamily = "Georgia"
    $fontTag = [System.Drawing.Font]::new("Arial", 14, [System.Drawing.FontStyle]::Bold)
    $fontTitle = [System.Drawing.Font]::new($fontFamily, 26, [System.Drawing.FontStyle]::Bold)
    $fontSub = [System.Drawing.Font]::new($fontFamily, 16, [System.Drawing.FontStyle]::Italic)
    $fontMotif = [System.Drawing.Font]::new($fontFamily, 22, [System.Drawing.FontStyle]::Bold)
    $fontHint = [System.Drawing.Font]::new("Consolas", 12, [System.Drawing.FontStyle]::Regular)

    $formatCenter = [System.Drawing.StringFormat]::new()
    $formatCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $formatCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

    $cherryBrush = [System.Drawing.SolidBrush]::new($cStroke)
    $goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#b8860b"))
    $subBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 60, 8, 20))
    $hintBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(160, 100, 30, 45))

    # Center illustration circle (Deep Cherry + Gold ring)
    $centerCirclePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 122, 12, 35), 3)
    $g.DrawEllipse($centerCirclePen, 260, 160, 280, 280)
    $centerCirclePen.Dispose()

    $centerFillBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 250, 245, 240))
    $g.FillEllipse($centerFillBrush, 265, 165, 270, 270)
    $centerFillBrush.Dispose()

    # Decorative inner gold ring
    $goldRingPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml("#d4af37"), 2)
    $goldRingPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
    $g.DrawEllipse($goldRingPen, 278, 178, 244, 244)
    $goldRingPen.Dispose()

    # Draw tag
    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $g.DrawString("* $($item.tag) *", $fontTag, $whiteBrush, 400, 52, $formatCenter)
    $whiteBrush.Dispose()

    # Draw Motif
    $g.DrawString($item.motif, $fontMotif, $cherryBrush, 400, 300, $formatCenter)

    # Draw Title
    $g.DrawString($item.title, $fontTitle, $cherryBrush, 400, 490, $formatCenter)

    # Draw Subtitle
    $g.DrawString($item.sub, $fontSub, $subBrush, 400, 540, $formatCenter)

    # Draw decorative divider line in Cherry & Gold
    $divPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 122, 12, 35), 1.5)
    $g.DrawLine($divPen, 240, 590, 560, 590)
    $divPen.Dispose()

    # Draw hint for user replacement
    $g.DrawString("Replace with photo: assets/images/$($item.file)", $fontHint, $hintBrush, 400, 630, $formatCenter)
    $g.DrawString("Pranjal 18th Birthday Scrapbook", $fontSub, $goldBrush, 400, 670, $formatCenter)

    # Cleanup
    $fontTag.Dispose()
    $fontTitle.Dispose()
    $fontSub.Dispose()
    $fontMotif.Dispose()
    $fontHint.Dispose()
    $cherryBrush.Dispose()
    $goldBrush.Dispose()
    $subBrush.Dispose()
    $hintBrush.Dispose()
    $g.Dispose()

    $outPath = Join-Path "assets\images" $item.file
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
    Write-Host "Regenerated Cherry Red Photo: $outPath"
}
