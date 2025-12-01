import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { analysisModel } from '../models/analysis.model'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { createObjectCsvWriter } from 'csv-writer'
import path from 'path'
import fs from 'fs'

/**
 * Export analysis to PDF
 */
export const exportToPdf = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const analysis = await analysisModel.findById(id)

    if (!analysis) {
      res.status(404).json({ message: 'Analysis not found' })
      return
    }

    if (analysis.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const { width, height } = page.getSize()
    let yPosition = height - 50

    // Title
    page.drawText('Lynalyze - URL Analysis Report', {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.05, 0.64, 0.91),
    })
    yPosition -= 40

    // URL
    page.drawText(`URL: ${analysis.url}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
    })
    yPosition -= 30

    // Title
    page.drawText(`Title: ${analysis.title}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
    })
    yPosition -= 25

    // Description
    if (analysis.description) {
      const descLines = wrapText(analysis.description, 80)
      descLines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 10,
          font: font,
        })
        yPosition -= 15
      })
    }
    yPosition -= 20

    // Text Analysis
    if (analysis.textAnalysis) {
      page.drawText('Text Analysis', {
        x: 50,
        y: yPosition,
        size: 16,
        font: boldFont,
      })
      yPosition -= 25

      page.drawText(`Word Count: ${analysis.textAnalysis.wordCount}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
      })
      yPosition -= 20

      page.drawText(
        `Sentiment: ${analysis.textAnalysis.sentiment.label} (${analysis.textAnalysis.sentiment.polarity.toFixed(2)})`,
        {
          x: 50,
          y: yPosition,
          size: 12,
          font: font,
        }
      )
      yPosition -= 30
    }

    // Date
    page.drawText(`Generated: ${new Date().toLocaleString()}`, {
      x: 50,
      y: 30,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    })

    const pdfBytes = await pdfDoc.save()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="analysis-${id}.pdf"`
    )
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error('Export PDF error:', error)
    res.status(500).json({ message: 'Failed to export PDF' })
  }
}

/**
 * Export analysis to CSV
 */
export const exportToCsv = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const analysis = await analysisModel.findById(id)

    if (!analysis) {
      res.status(404).json({ message: 'Analysis not found' })
      return
    }

    if (analysis.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    // Prepare word frequency data
    const records = analysis.textAnalysis?.wordFrequency
      ? Object.entries(analysis.textAnalysis.wordFrequency).map(
          ([word, count]) => ({
            word,
            count,
          })
        )
      : []

    // Create temporary file
    const tempPath = path.join('/tmp', `analysis-${id}.csv`)
    const csvWriter = createObjectCsvWriter({
      path: tempPath,
      header: [
        { id: 'word', title: 'Word' },
        { id: 'count', title: 'Frequency' },
      ],
    })

    await csvWriter.writeRecords(records)

    // Read and send file
    const fileStream = fs.createReadStream(tempPath)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="analysis-${id}.csv"`
    )

    fileStream.pipe(res)

    // Clean up temp file after sending
    fileStream.on('end', () => {
      fs.unlinkSync(tempPath)
    })
  } catch (error) {
    console.error('Export CSV error:', error)
    res.status(500).json({ message: 'Failed to export CSV' })
  }
}

// Helper function to wrap text
function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine += word + ' '
    }
  })

  if (currentLine) {
    lines.push(currentLine.trim())
  }

  return lines
}
