import { Alert, Pressable, Text, View, StyleSheet, Image } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import Colors from "../constants/colors";

function ImagePicker({ rotation }) {
  const [imagePicked, setImagePicked] = useState();
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();

  async function checkPermissionsHandler() {
    if (cameraPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert("Permission Denied", "Camera permission was denied :(");
      return false;
    }

    return true;
  }
  async function cameraLaunchingHandler() {
    const hasPermission = await checkPermissionsHandler();
    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);

    setImagePicked(image.uri);
  }

  let imgPreview = <Text style={styles.text}>+</Text>;

  if (imagePicked) {
    imgPreview = <Image source={{ uri: imagePicked }} />;
  }

  return (
    <View
      style={{
        transform: rotation,
        borderRadius: 10,
        borderColor: "#dedede",
        borderWidth: 3,
        backgroundColor: Colors.lightGrey2
      }}
    >
      <Pressable onPress={cameraLaunchingHandler}>
        <View style={styles.img}>{imgPreview}</View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 150,
    width: 130,
  },
  text: {
    fontFamily: "Afacad",
    fontSize: 20,
    color: Colors.lightGrey,
    textAlign: "center",
    justifyContent: "center"
  },
});

export default ImagePicker;
