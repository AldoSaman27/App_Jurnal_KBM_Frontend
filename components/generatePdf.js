import { Alert } from "react-native";
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from "expo-print";

const generateHTML = ({
  foto,
  name,
  nip,
  mapel,
  jurnal,
  semester,
  tahunPelajaran,
  mengampuhDi,
}) => {
  const jurnalRows = jurnal
    .map((item, index) => {
      const [year, month, day] = item.hari_tanggal.split("-");
      const hari_tanggal = new Date(year, month - 1, day);
      const dateFormatter = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedDate = dateFormatter.format(hari_tanggal);
      return `
            <tr key="${index}">
                <td>${index + 1}</td>
                <td>${formattedDate}</td>
                <td>${item.jam_ke}</td>
                <td>${item.kelas}</td>
                <td>${item.uraian_kegiatan}</td>
                <td>${item.kehadiran}</td>
                <td><img src="${
                  process.env.EXPO_PUBLIC_API_URL
                }/uploads/foto_kegiatan/${
        item.foto_kegiatan
      }" alt="" width="200" height="115" style="object-fit: cover;"></td>
            </tr>
        `;
    })
    .join("");

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      </head>
      <body>
          <h1 class="text-center mb-4">Jurnal KBM Guru</h1>
          <div class="d-flex gap-4">
              <img src="${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${
    foto || "User_Profile.png"
  }" alt="" class="rounded-circle border border-5 border-primary" style="width: 200px; height: 200px; object-fit: cover; aspect-ratio: 1 / 1;">
              <table>
                  <tbody>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">Nama</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            name || "-"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">NIP</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            nip || "-"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">Mata Pelajaran</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            mapel || "-"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">Semester</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            semester || "-"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">Tahun Pelajaran</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            tahunPelajaran || "-"
                          }</td>
                      </tr>
                      <tr>
                          <td style="padding: 5px 10px; font-weight: bold;">Mengampuh Di</td>
                          <td style="padding: 5px 10px; font-weight: bold;">:</td>
                          <td style="padding: 5px 10px; font-weight: bold;">${
                            mengampuhDi || "-"
                          }</td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <table class="table table-bordered mt-4">
              <thead>
                  <tr>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">No</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Hari / Tanggal</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Jam Pembelajaran</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Kelas</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Uraian Kegiatan</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Kehadiran</th>
                      <th class="bg-primary text-white" style="background-color: #2099FF;">Foto Kegiatan</th>
                  </tr>
              </thead>
              <tbody>
                  ${jurnalRows}
              </tbody>
          </table>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </body>
      </html>
    `;
};

const generatePdf = async (
  foto,
  name,
  nip,
  mapel,
  jurnal,
  semester,
  tahunPelajaran,
  mengampuhDi
) => {
  try {
    const html = generateHTML({
      foto: foto,
      name: name,
      nip: nip,
      mapel: mapel,
      jurnal: jurnal,
      semester: semester,
      tahunPelajaran: tahunPelajaran,
      mengampuhDi: mengampuhDi,
    });

    const file = await printToFileAsync({
      html: html,
      base64: false,
      orientation: "landscape",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    return await shareAsync(file.uri);
  } catch (error) {
    return Alert.alert(
      "Sorry!",
      "Ada masalah dengan aplikasi kami. Mohon hubungi tim pengembang!"
    );
  }
};

export default generatePdf;
