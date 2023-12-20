import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
    buildBugsPDF,
}

function buildBugsPDF(bugs, fileName) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument()
        const writeStream = fs.createWriteStream(fileName)

        doc.pipe(writeStream)

        doc.on('end', () => {
            resolve()
        })

        doc.on('error', (err) => {
            reject(err)
        })

        bugs.forEach((bug, idx) => {
            doc.fontSize(25).text(`Meet ${bug.title}`, {
                width: 410,
                align: 'left',
            })

            doc.fontSize(15).moveDown().text(`About: ${bug.description}`, {
                width: 410,
                align: 'left',
            })

            doc.fontSize(15).moveDown().text(`Severity: ${bug.severity}`, {
                width: 410,
                align: 'left',
            })

            if (idx < bugs.length - 1) doc.addPage()
        })

        doc.end()
    })
}
