import Icon1 from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

const index = () => {
  const [accessToken, setAccessToken] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [mapel, setMapel] = useState("");
  const [foto, setFoto] = useState("");
  const [email, setEmail] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [updated_at, setUpdated_at] = useState("");

  const [date, setDate] = useState(new Date());
  const [jurnal, setJurnal] = useState([]);
  const [isReload, setIsReload] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchAccessToken = await AsyncStorage.getItem("accessToken");
      setAccessToken(fetchAccessToken);
      const fetchId = await AsyncStorage.getItem("id");
      setId(fetchId);
      const fetchName = await AsyncStorage.getItem("name");
      setName(fetchName);
      const fetchNip = await AsyncStorage.getItem("nip");
      setNip(fetchNip);
      const fetchMapel = await AsyncStorage.getItem("mapel");
      setMapel(fetchMapel);
      const fetchFoto = await AsyncStorage.getItem("foto");
      setFoto(fetchFoto);
      const fetchEmail = await AsyncStorage.getItem("email");
      setEmail(fetchEmail);
      const fetchCreated_at = await AsyncStorage.getItem("created_at");
      setCreated_at(fetchCreated_at);
      const fetchUpdated_at = await AsyncStorage.getItem("updated_at");
      setUpdated_at(fetchUpdated_at);

      setIsLoading(true);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${fetchAccessToken}`;
      axios.defaults.headers.common["Accept"] = "application/json";
      await axios
        .get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/index/${fetchNip}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`
        )
        .then((res) => {
          setIsLoading(false);
          setJurnal(res.data.jurnal);
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response.status === 422)
            return Alert.alert(
              "Sorry!",
              "Ada masalah dengan aplikasi kami. Mohon hubungi tim pengembang!"
            );

          Alert.alert(
            "Sorry!",
            "Internal Server Error. Please contact the development team!"
          );
        });
    };

    fetchData();
    setIsReload(false);
  }, [isReload]);

  const [isLoading, setIsLoading] = useState(false);

  const html = `
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
                <img src="${
                  process.env.EXPO_PUBLIC_API_URL
                }/uploads/foto/${foto}" alt="" class="rounded-circle border border-5 border-primary" style="width: 200px; height: 200px; object-fit: cover; aspect-ratio: 1 / 1;">
                <table>
                    <tbody>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">Nama</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">NIP</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">${nip}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">Mata Pelajaran</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">${mapel}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">Semester</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">-</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">Tahun Pelajaran</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">-</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px; font-weight: bold;">Mengampuh Di</td>
                            <td style="padding: 5px 10px; font-weight: bold;">:</td>
                            <td style="padding: 5px 10px; font-weight: bold;">-</td>
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
                    ${jurnal
                      .map((item, index) => {
                        // Memecah tanggal menjadi bagian-bagian (hari, bulan, tahun)
                        const [year, month, day] = item.hari_tanggal.split("-");

                        // Membuat objek Date dari bagian-bagian tanggal
                        const hari_tanggal = new Date(year, month - 1, day); // Bulan dimulai dari 0 (Januari = 0), sehingga perlu dikurangi 1

                        // Membuat objek formatter untuk menampilkan tanggal dalam format yang diinginkan
                        const dateFormatter = new Intl.DateTimeFormat("id-ID", {
                          weekday: "long", // Nama hari dalam bahasa Indonesia
                          day: "numeric", // Hari dalam angka
                          month: "long", // Nama bulan dalam bahasa Indonesia
                          year: "numeric", // Tahun
                        });

                        // Format tanggal menggunakan objek formatter
                        const formattedDate =
                          dateFormatter.format(hari_tanggal);

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
                      .join("")}
                </tbody>
            </table>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
        </html>
    `;

  const generatePdf = async () => {
    setIsLoading(true);
    try {
      const file = await printToFileAsync({
        html: html,
        base64: false,
        orientation: "landscape",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      await shareAsync(file.uri);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Sorry!",
        "Ada masalah dengan aplikasi kami. Mohon hubungi tim pengembang!"
      );
    }
  };

  const [show, setShow] = useState(false);
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

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setIsReload(true);
    setShow(false);
    return 1;
  };

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        <Image
          source={`${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${foto}`}
          style={{
            width: 150,
            height: 150,
            borderWidth: 5,
            borderColor: "#2099FF",
            borderRadius: 100,
            marginBottom: 20,
          }}
        />
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>{name}</Text>
        <View
          style={{
            width: "100%",
            maxHeight: 60,
            padding: 20,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: 500 }}>Personal Info</Text>
          <Text
            style={{ fontSize: 15, fontWeight: 500 }}
            onPress={() => router.replace("/login")}
          >
            Edit
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#EAEAEA",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Icon1 name="text-snippet" size={30} color={"#2099FF"} />
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
            >
              NIP
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{nip}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#EAEAEA",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Icon1 name="subject" size={30} color={"#2099FF"} />
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
            >
              Mapel
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{mapel}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#EAEAEA",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
            }}
          >
            <Icon1 name="email" size={30} color={"#2099FF"} />
            <Text
              style={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
            >
              Email
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{email}</Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            maxHeight: 60,
            padding: 20,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: 500 }}>Jurnal</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#2099FF",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Link
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#FFF",
              width: "100%",
              textAlign: "center",
            }}
            href="/(jurnal)/buat"
          >
            Buat Jurnal
          </Link>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#2099FF",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Link
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#FFF",
              width: "100%",
              textAlign: "center",
            }}
            href="/(jurnal)/lihat"
          >
            Lihat Jurnal
          </Link>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#2099FF",
            width: "90%",
            maxHeight: 50,
            borderRadius: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#FFF",
              width: "100%",
              textAlign: "center",
            }}
          >
            Unduh Jurnal
          </Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={modalVisible}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Unduh Jurnal</Text>
                <Icon1
                  name="close"
                  size={30}
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={styles.formGroup}>
                <Icon2
                  name="calendar"
                  style={styles.icon}
                  size={20}
                  color="#000"
                />
                <Text style={styles.inputGroup} onPress={() => setShow(true)}>
                  {getFormattedDate(date)}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2099FF",
                  width: "100%",
                  minHeight: 50,
                  borderRadius: 10,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
                onPress={() => {
                  setModalVisible(false);
                  generatePdf();
                }}
                disabled={isLoading}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#FFF",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Unduh Jurnal
                </Text>
              </TouchableOpacity>

              {show && (
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeDate}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default index;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    minHeight: "20%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 15,
  },
  modalHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputGroup: {
    backgroundColor: "#EAEAEA",
    padding: 5,
    width: "85%",
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#EAEAEA",
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
