import PDFDocument from 'pdfkit'
import handleRoleChangeToIND from './handleRoleChangeToIND.js'

export const pdfWarrant = (data, dataCallback, endCallback) => {
   const doc = new PDFDocument()
   doc.on('data', dataCallback)
   doc.on('end', endCallback)

   doc.fontSize(14).text('CV. BINA ALAM TESLARI', {
      align: 'center',
      lineGap: 1,
   })

   doc.fontSize(12).text(
      `JL, LPPU Km. 3 Kawasan Kartika Alas (Utama depan pintu A Mitshubishi logistic) curug 15810 - Tangerang Banten`,
      {
         align: 'center',
      }
   )

   doc.moveDown()
   doc.moveDown()

   doc.fontSize(14).text('SURAT PERINTAH', { align: 'center', underline: true })

   doc.moveDown()
   doc.moveDown()

   // Kepala Bagian
   doc.fontSize(12).text('Yang bertanda tangan di bawah ini')
   doc.moveDown()
   doc.fontSize(12).text(`Nama      : ${data?.approved_by?.name}`, {
      lineGap: 1,
      indent: 30,
   })
   doc.fontSize(12).text(
      `Jabatan   : ${handleRoleChangeToIND(data?.approved_by?.role)}`,
      { lineGap: 1, indent: 30 }
   )
   doc.moveDown()

   // Staff
   doc.fontSize(12).text('Menugaskan Kepada Saudara')
   doc.moveDown()
   doc.fontSize(12).text(`Nama      : ${data?.mechanical?.name || undefined}`, {
      lineGap: 1,
      indent: 30,
   })
   doc.fontSize(12).text(
      `Jabatan   : ${handleRoleChangeToIND(
         data?.mechanical?.role || undefined
      )}`,
      { lineGap: 1, indent: 30 }
   )
   doc.moveDown()
   doc.fontSize(12).text(
      'Untuk melakukan perbaikan mesin produksi CV. Bina Alam Lestari dengan keterangan mesin sebagai berikut :',
      { lineGap: 1 }
   )

   doc.moveDown()
   doc.fontSize(12).text(`Kode Mesin      : ${data?.machine?.code}`, {
      lineGap: 1,
      indent: 30,
   })
   doc.fontSize(12).text(`Nama Mesin     : ${data?.machine?.name}`, {
      lineGap: 1,
      indent: 30,
   })
   doc.fontSize(12).text(`Kendala            : ${data?.complaint}`, {
      lineGap: 1,
      indent: 30,
   })

   doc.moveDown()
   doc.fontSize(12).text(
      'Demikian Surat Tugas ini dibuat untuk dipergunakan seperlunya',
      { lineGap: 1 }
   )

   doc.moveDown()
   doc.moveDown()
   doc.moveDown()

   doc.text(
      new Date(data?.createdAt).toLocaleDateString('id', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      }),
      { align: 'right' }
   )

   doc.moveDown()

   doc.fontSize(12).text(`${data?.approved_by?.name}`, {
      lineGap: 1,
      align: 'right',
      underline: true,
   })
   doc.fontSize(12).text(`${handleRoleChangeToIND(data?.approved_by?.role)}`, {
      lineGap: 1,
      align: 'right',
   })

   doc.end()
}
