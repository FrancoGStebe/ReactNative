import { Pressable, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {BottomSheetModal} from "@gorhom/bottom-sheet";

function CheckMark({ id, completed, toggleTodo }) {
    async function toggle() {
        try {
            const response = await fetch(`http://192.168.0.6:8080/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    value: !completed, // Alterna el valor de "completed"
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toggleTodo(id); // Llama a la función para actualizar el estado en el componente padre
                console.log(data);
            } else {
                console.error("Error al actualizar la tarea:", response.status);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return (
        <Pressable
            onPress={toggle}
            style={[
                styles.checkMark,
                { backgroundColor: completed ? "#0EA5E9" : "#E9E9EF" }, // Cambia el color según el estado
            ]}
        />
    );
}

export default function Task({
    id,
    title,
    shared_whit_id,
    completed,
    toggleTodo,
    clearTodo,
}) {
    const [isDeleteActive, setDeleteActive] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const sharedBottomSheetRef = useRef(null);
    const snapPoints = ["25%", "48%", "75%"];
    const snapPointsShared = ["40%"];

    function handlePresentModal(){
        bottomSheetModalRef.current?.present();
    }

    function handlePresentShared(){
        sharedBottomSheetRef.current?.present();
    }

    async function deleteTodo() {
        try {
            const response = await fetch(`http://192.168.0.6:8080/todos/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                clearTodo(id); // Llama a la función para eliminar la tarea en el componente padre
                console.log("Tarea eliminada");
            } else {
                console.error("Error al eliminar la tarea:", response.status);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    return (
        <TouchableOpacity
            onLongPress={() => setDeleteActive(true)}
            onPress={() => setDeleteActive(false)}
            activeOpacity={0.8}
            style={styles.container}
        >
            <View style={styles.taskContainer}>
                {/* Pasa las props necesarias al componente CheckMark */}
                <CheckMark id={id} completed={completed} toggleTodo={toggleTodo} />
                <Text>{{title : "Título no disponible"}}</Text>
            </View>
            {shared_whit_id !== null ? (
                <Feather  onPress={handlePresentShared} name="users" size={20} color="#383839" />
            ) : (
                <Feather  onPress={handlePresentModal} name="shares" size={20} color="#383839" />
            )}
            {isDeleteActive && (
                <Pressable onPress={deleteTodo} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>X</Text>
                </Pressable>
            )}

            <BottomSheetModal
            ref={sharedBottomSheetRef}
            snapPoints={snapPointsShared}
            backgroundStyle= {{borderRadius: 50, borderWidth: 4}}
            >
            <Text>holaaaaa</Text>
            </BottomSheetModal>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        marginVertical: 8,
        backgroundColor: "#F9FAFB",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: "relative",
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    checkMark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 12,
    },
    deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#DC2626",
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
});
