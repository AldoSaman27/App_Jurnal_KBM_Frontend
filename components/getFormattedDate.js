const getFormattedDate = (dateValue) => {
  // Membuat objek formatter untuk menampilkan tanggal dalam format yang diinginkan
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long", // Nama hari dalam bahasa Indonesia
    day: "numeric", // Hari dalam angka
    month: "long", // Nama bulan dalam bahasa Indonesia
    year: "numeric", // Tahun
  });

  // Format tanggal menggunakan objek formatter
  return dateFormatter.format(dateValue);
};

export default getFormattedDate;
