import { View } from "react-native"

export const Col = ({ numRows, children, colStyle }) => {
    return (
        <View style={colStyle}>{children}</View>
    )
}