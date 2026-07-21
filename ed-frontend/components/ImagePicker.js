import { Alert, Pressable, Text, View, StyleSheet, Image } from "react-native";

import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";

import Colors from "../constants/colors";

function ImagePicker({ rotation, image, onPickImage }) {
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();

  async function checkPermissionsHandler() {
    if (cameraPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert("Permission Denied", "Camera permission denied.");

      return false;
    }

    return true;
  }

  async function cameraLaunchingHandler() {
    const hasPermission = await checkPermissionsHandler();

    if (!hasPermission) {
      return;
    }

    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      onPickImage(result.assets[0].uri);
    }
  }

  let imgPreview = <Text style={styles.text}>+</Text>;

  if (image) {
    imgPreview = <Image source={{ uri: image }} style={styles.img} />;
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          transform: rotation,
        },
      ]}
    >
      <Pressable onPress={cameraLaunchingHandler}>
        <View style={styles.img}>{imgPreview}</View>
      </Pressable>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
    borderColor: "#dedede",
    borderWidth: 3,
    backgroundColor: Colors.lightGrey2,
  },

  img: {
    width: 130,
    height: 150,
    overflow: "hidden",
  },

  text: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 60,
  },
});
