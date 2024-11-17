import { StyleSheet } from "react-native";
import COLORS from "./color";

const styles = StyleSheet.create({
    header:{
        paddingTop:20,
        // marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor:COLORS.primary,
        height:150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius:30
    },
    card: {
        backgroundColor: COLORS.white,
        width: '85%',
        top: -25,
        borderRadius:15
    }

})

export default styles;