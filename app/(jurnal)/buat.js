import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";

const BuatJurnal = () => {
  const [accessToken, setAccessToken] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [NIP, setNIP] = useState("");
  const [mapel, setMapel] = useState("");
  const [foto, setFoto] = useState("");
  const [email, setEmail] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [updated_at, setUpdated_at] = useState("");

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
    };

    fetchData();
  }, []);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [jamPembelajaran, setJamPembelajaran] = useState("");
  const [kelas, setKelas] = useState("");
  const [uraianKegiatan, setUraianKegiatan] = useState("");
  const [siswaHadir, setSiswaHadir] = useState("");
  const [siswaTanpaKabar, setSiswaTanpaKabar] = useState("");
  const [siswaSakit, setSiswaSakit] = useState("");
  const [siswaIzin, setSiswaIzin] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setShow(false);
  };

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (
      jamPembelajaran === "" ||
      jamPembelajaran.length === 0 ||
      jamPembelajaran === null ||
      jamPembelajaran === undefined
    ) {
      return Alert.alert("Opss!", "Jam Pembelajaran is required!");
    } else if (
      kelas === "" ||
      kelas.length === 0 ||
      kelas === null ||
      kelas === undefined
    ) {
      return Alert.alert("Opss!", "Kelas is required!");
    } else if (
      uraianKegiatan === "" ||
      uraianKegiatan.length === 0 ||
      uraianKegiatan === null ||
      uraianKegiatan === undefined
    ) {
      return Alert.alert("Opss!", "Uraian Kegiatan is required!");
    } else if (
      siswaHadir === "" ||
      siswaHadir.length === 0 ||
      siswaHadir === null ||
      siswaHadir === undefined
    ) {
      return Alert.alert("Opss!", "Siswa Hadir is required!");
    } else if (
      siswaTanpaKabar === "" ||
      siswaTanpaKabar.length === 0 ||
      siswaTanpaKabar === null ||
      siswaTanpaKabar === undefined
    ) {
      return Alert.alert("Opss!", "Siswa Tanpa Kabar is required!");
    } else if (
      siswaSakit === "" ||
      siswaSakit.length === 0 ||
      siswaSakit === null ||
      siswaSakit === undefined
    ) {
      return Alert.alert("Opss!", "Siswa Sakit is required!");
    } else if (
      siswaIzin === "" ||
      siswaIzin.length === 0 ||
      siswaIzin === null ||
      siswaIzin === undefined
    ) {
      return Alert.alert("Opss!", "Siswa Izin is required!");
    } else if (!image) {
      return Alert.alert("Opss!", "Foto Kegiatan is required!");
    }

    setIsLoading(true);

    const formattedDate = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

    const formData = new FormData();
    formData.append("nip", NIP);
    formData.append("hari_tanggal", formattedDate);
    formData.append("jam_ke", jamPembelajaran);
    formData.append("kelas", kelas);
    formData.append("uraian_kegiatan", uraianKegiatan);
    formData.append(
      "kehadiran",
      `${siswaHadir} Hadir, ${siswaTanpaKabar} Tanpa Kabar, ${siswaSakit} Sakit, ${siswaIzin} Izin`
    );
    formData.append("foto_kegiatan", {
      uri: image,
      name: imageFile.fileName,
      type: imageFile.mimeType,
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.headers.common["Accept"] = "application/json";
    axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/store`, formData)
      .then((res) => {
        setIsLoading(false);
        Alert.alert(
          "Success!",
          "Berhasil membuat Jurnal.",
          [
            {
              text: "Oke",
              onPress: () => router.replace("/"),
            },
          ],
          {
            cancelable: false,
          }
        );
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
    return 1;
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2099FF" }}>
          Buat Jurnal
        </Text>
        <View style={styles.formGroup}>
          <Icon name="calendar" style={styles.icon} size={20} color="#000" />
          <Text style={styles.inputGroup} onPress={() => setShow(true)}>
            {getFormattedDate(date)}
          </Text>
        </View>
        <View style={styles.formGroup}>
          <Icon name="clock-o" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.inputGroup}
            placeholder="Jam Pembelajaran"
            onChangeText={(text) => setJamPembelajaran(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon name="building" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.inputGroup}
            placeholder="Kelas"
            autoCapitalize={"characters"}
            onChangeText={(text) => setKelas(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon name="list" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.inputGroup}
            placeholder="Uraian Kegiatan"
            onChangeText={(text) => setUraianKegiatan(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon name="users" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.inputGroup}
            placeholder="Hadir"
            inputMode="numeric"
            onChangeText={(text) => setSiswaHadir(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon name="user-times" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.inputGroup}
            placeholder="Tanpa Kabar"
            inputMode="numeric"
            onChangeText={(text) => setSiswaTanpaKabar(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon
            name="user-md"
            style={{ padding: 5, paddingLeft: 13.5, paddingRight: 13.5 }}
            size={23}
            color="#000"
          />
          <TextInput
            style={styles.inputGroup}
            placeholder="Sakit"
            inputMode="numeric"
            onChangeText={(text) => setSiswaSakit(text)}
          />
        </View>
        <View style={styles.formGroup}>
          <Icon
            name="user-plus"
            style={{ padding: 5, paddingLeft: 12.5, paddingRight: 12.5 }}
            size={20}
            color="#000"
          />
          <TextInput
            style={styles.inputGroup}
            placeholder="Izin"
            inputMode="numeric"
            onChangeText={(text) => setSiswaIzin(text)}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#2099FF",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={pickImage}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              textAlign: "center",
              color: "#FFF",
            }}
          >
            Pilih Foto Kegiatan
          </Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: "100%",
              height: 210,
              borderRadius: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#2099FF",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              textAlign: "center",
              color: "#FFF",
            }}
          >
            {isLoading ? "Please Wait..." : "Submit"}
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
    </ScrollView>
  );
};

export default BuatJurnal;

const styles = StyleSheet.create({
  inputGroup: {
    backgroundColor: "#FFF",
    padding: 5,
    width: "85%",
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
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
