import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
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

// Components
import fetchFromAsyncStorage from "../../components/fetchFromAsyncStorage";
import getFormattedDate from "../../components/getFormattedDate";

const BuatJurnal = () => {
  const [storageData, setStorageData] = useState({
    accessToken: null,
    id: null,
    name: null,
    nip: null,
    mapel: null,
    foto: null,
    email: null,
    created_at: null,
    updated_at: null,
  });
  const [date, setDate] = useState(new Date());
  const [dateShow, setDateShow] = useState(false);
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

  const {
    accessToken,
    id,
    name,
    nip,
    mapel,
    foto,
    email,
    created_at,
    updated_at,
  } = storageData;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();
      setStorageData(fetchedData);
    };

    fetchData();
  }, []);

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setDateShow(false);
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

  const handleSubmit = async () => {
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

    const formData = new FormData();
    formData.append("nip", nip);
    formData.append(
      "hari_tanggal",
      `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-
      ${("0" + date.getDate()).slice(-2)}`
    );
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
    await axios
      .post(`${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/store`, formData)
      .then(() => {
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
      .catch(() => {
        setIsLoading(false);

        return Alert.alert(
          "Sorry!",
          "Internal Server Error. Please contact the development team!"
        );
      });
    return 1;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Buat Jurnal</Text>
        <View style={styles.form_group}>
          <Icon name="calendar" style={styles.icon} size={20} color="#000" />
          <Text style={styles.input_group} onPress={() => setDateShow(true)}>
            {getFormattedDate(date)}
          </Text>
        </View>
        <View style={styles.form_group}>
          <Icon name="clock-o" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Jam Pembelajaran"
            onChangeText={(text) => setJamPembelajaran(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="building" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Kelas"
            autoCapitalize={"characters"}
            onChangeText={(text) => setKelas(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="list" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Uraian Kegiatan"
            onChangeText={(text) => setUraianKegiatan(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="users" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Hadir"
            inputMode="numeric"
            onChangeText={(text) => setSiswaHadir(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="user-times" style={styles.icon} size={20} color="#000" />
          <TextInput
            style={styles.input_group}
            placeholder="Tanpa Kabar"
            inputMode="numeric"
            onChangeText={(text) => setSiswaTanpaKabar(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="user-md" style={styles.icon_user_md} size={23} />
          <TextInput
            style={styles.input_group}
            placeholder="Sakit"
            inputMode="numeric"
            onChangeText={(text) => setSiswaSakit(text)}
          />
        </View>
        <View style={styles.form_group}>
          <Icon name="user-plus" style={styles.icon_user_plus} size={20} />
          <TextInput
            style={styles.input_group}
            placeholder="Izin"
            inputMode="numeric"
            onChangeText={(text) => setSiswaIzin(text)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.button_text}>Pilih Foto Kegiatan</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.pick_image} />}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.button_text}>
            {isLoading ? "Please Wait..." : "Submit"}
          </Text>
        </TouchableOpacity>

        {dateShow && (
          <View style={styles.date_time_picker_view}>
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
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2099FF",
  },
  input_group: {
    backgroundColor: "#FFF",
    padding: 5,
    width: "85%",
  },
  form_group: {
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
  icon_user_md: {
    padding: 5,
    paddingLeft: 13.5,
    paddingRight: 13.5,
  },
  icon_user_plus: {
    padding: 5,
    paddingLeft: 12.5,
    paddingRight: 12.5,
  },
  button: {
    backgroundColor: "#2099FF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  button_text: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
  },
  pick_image: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  date_time_picker_view: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
