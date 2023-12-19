import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
    buildBugsPDF,
}

function buildBugsPDF(Bugs, fileName) {
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

        Bugs.forEach((Bug, idx) => {
            doc.fontSize(25).text(`Meet ${Bug.title}`, {
                width: 410,
                align: 'left',
            })

            doc.fontSize(15).moveDown().text(`About: ${Bug.description}`, {
                width: 410,
                align: 'left',
            })

            doc.fontSize(15).moveDown().text(`Severity: ${Bug.severity}`, {
                width: 410,
                align: 'left',
            })

            if (idx < Bugs.length - 1) doc.addPage()
        })

        doc.end()
    })
}
