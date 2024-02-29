import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

const LihatJurnal = () => {
  const [accessToken, setAccessToken] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [NIP, setNIP] = useState("");
  const [mapel, setMapel] = useState("");
  const [foto, setFoto] = useState("");
  const [email, setEmail] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [updated_at, setUpdated_at] = useState("");

  const [jurnal, setJurnal] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchAccessToken = await AsyncStorage.getItem("accessToken");
      setAccessToken(fetchAccessToken);
      const fetchId = await AsyncStorage.getItem("id");
      setId(fetchId);
      const fetchName = await AsyncStorage.getItem("name");
      setName(fetchName);
      const fetchNip = await AsyncStorage.getItem("nip");
      setNIP(fetchNip);
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
          setJurnal(res.data.jurnal);
        })
        .catch((err) => {
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
  }, [isUpdate]);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[monthNumber];
  };

  const handleDeleteConfirm = async (id) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.headers.common["Accept"] = `application/json`;
    await axios
      .delete(`${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/destroy/${id}`)
      .then((res) => {
        setIsUpdate(true);
      })
      .catch((err) => {
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

  const handleDelete = async (id) => {
    Alert.alert("Opss..", "Are you sure you want to delete this journal?", [
      {
        text: "Oke",
        onPress: () => handleDeleteConfirm(id),
      },
      {
        text: "Cancel",
      },
    ]);
    return 1;
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2099FF" }}>
            Jurnal - {getMonthName(date.getMonth())} {date.getFullYear()}
          </Text>
          <Text
            style={{ fontSize: 15, fontWeight: 500 }}
            onPress={() => setShow(true)}
          >
            Edit
          </Text>
        </View>

        {jurnal.map((item, index) => {
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
          const formattedDate = dateFormatter.format(hari_tanggal);

          return (
            <View
              key={index}
              style={{
                backgroundColor: "#FFF",
                marginBottom: 10,
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                borderTopWidth: 5,
                borderTopColor: "#2099FF",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#757575", fontWeight: "bold" }}>
                  Hari / Tanggal
                </Text>
                <Text style={{ color: "#000", fontWeight: "bold" }}>
                  {formattedDate}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#757575", fontWeight: "bold" }}>
                  Jam Pembelajaran
                </Text>
                <Text style={{ color: "#000", fontWeight: "bold" }}>
                  {item.jam_ke}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#757575", fontWeight: "bold" }}>
                  Kelas
                </Text>
                <Text style={{ color: "#000", fontWeight: "bold" }}>
                  {item.kelas}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#757575", fontWeight: "bold" }}>
                  Uraian Kegiatan
                </Text>
                <Text
                  style={{ color: "#000", fontWeight: "bold", maxWidth: "50%" }}
                >
                  {item.uraian_kegiatan}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Text style={{ color: "#757575", fontWeight: "bold" }}>
                  Kehadiran
                </Text>
                <Text
                  style={{ color: "#000", fontWeight: "bold", maxWidth: "50%" }}
                >
                  {item.kehadiran}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/foto_kegiatan/${item.foto_kegiatan}`,
                  }}
                  style={{
                    width: "100%",
                    height: 210,
                    borderRadius: 10,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </View>

              <View
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#DC3545",
                    padding: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 10,
                  }}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

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
    </ScrollView>
  );
};

export default LihatJurnal;
