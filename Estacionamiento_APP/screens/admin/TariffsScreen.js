import React, { useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import COLORS from '../../constants/colors';

const DEFAULT_TARIFFS = {
	hourlyPrice: '2500',
	extraMinutes: '30',
	freeMinutes: '10',
	nightEnabled: false,
	nightPrice: '3000',
	dailyLimitEnabled: true,
	dailyLimit: '18000',
};

function PriceInput({ label, value, onChangeText, suffix }) {
	return (
		<View style={styles.inputGroup}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.inputRow}>
				<TextInput
					style={styles.input}
					value={value}
					onChangeText={onChangeText}
					keyboardType="numeric"
					placeholder="0"
					placeholderTextColor={COLORS.textSecondary}
				/>
				<Text style={styles.suffix}>{suffix}</Text>
			</View>
		</View>
	);
}

function RuleSwitch({ label, value, onValueChange }) {
	return (
		<View style={styles.switchRow}>
			<Text style={styles.switchLabel}>{label}</Text>
			<Switch
				value={value}
				onValueChange={onValueChange}
				trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
				thumbColor={COLORS.surface}
			/>
		</View>
	);
}

export default function TariffsScreen() {
	const [tariffs, setTariffs] = useState(DEFAULT_TARIFFS);

	const updateTariff = (name, value) => {
		setTariffs((currentTariffs) => ({ ...currentTariffs, [name]: value }));
	};

	const resetTariffs = () => setTariffs({ ...DEFAULT_TARIFFS });

	const showSaveMessage = () => {
		Alert.alert(
			'Cambios de ejemplo',
			'Los valores solo se guardan mientras esta pantalla está abierta. Para guardarlos de forma permanente hay que conectarlos a la base de datos.',
		);
	};

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.content}>
			<Text style={styles.title}>Tarifas</Text>
			<Text style={styles.description}>
				Edita los precios y las reglas de cobro del estacionamiento.
			</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Precio por uso</Text>
				<PriceInput
					label="Precio por hora"
					value={tariffs.hourlyPrice}
					onChangeText={(value) => updateTariff('hourlyPrice', value)}
					suffix="$ / hora"
				/>
				<PriceInput
					label="Cada cuántos minutos se cobra otra fracción"
					value={tariffs.extraMinutes}
					onChangeText={(value) => updateTariff('extraMinutes', value)}
					suffix="minutos"
				/>
				<PriceInput
					label="Minutos de cortesía al entrar"
					value={tariffs.freeMinutes}
					onChangeText={(value) => updateTariff('freeMinutes', value)}
					suffix="minutos"
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Reglas especiales</Text>
				<RuleSwitch
					label="Usar una tarifa nocturna"
					value={tariffs.nightEnabled}
					onValueChange={(value) => updateTariff('nightEnabled', value)}
				/>
				{tariffs.nightEnabled && (
					<PriceInput
						label="Precio por hora en la noche"
						value={tariffs.nightPrice}
						onChangeText={(value) => updateTariff('nightPrice', value)}
						suffix="$ / hora"
					/>
				)}
				<View style={styles.separator} />
				<RuleSwitch
					label="Limitar el cobro por día"
					value={tariffs.dailyLimitEnabled}
					onValueChange={(value) => updateTariff('dailyLimitEnabled', value)}
				/>
				{tariffs.dailyLimitEnabled && (
					<PriceInput
						label="Cobro máximo por día"
						value={tariffs.dailyLimit}
						onChangeText={(value) => updateTariff('dailyLimit', value)}
						suffix="$ / día"
					/>
				)}
			</View>

			<TouchableOpacity style={styles.saveButton} onPress={showSaveMessage}>
				<Text style={styles.saveButtonText}>Guardar cambios</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.resetButton} onPress={resetTariffs}>
				<Text style={styles.resetButtonText}>Restablecer valores de ejemplo</Text>
			</TouchableOpacity>
			<Text style={styles.note}>
				Plantilla de prueba: los cambios no se guardan de forma permanente.
			</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	content: {
		padding: 20,
		paddingBottom: 36,
	},
	title: {
		color: COLORS.text,
		fontSize: 28,
		fontWeight: '700',
	},
	description: {
		color: COLORS.textSecondary,
		fontSize: 15,
		lineHeight: 22,
		marginTop: 6,
		marginBottom: 20,
	},
	section: {
		backgroundColor: COLORS.surface,
		borderColor: COLORS.border,
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 16,
		padding: 16,
	},
	sectionTitle: {
		color: COLORS.text,
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	inputGroup: {
		marginBottom: 14,
	},
	label: {
		color: COLORS.text,
		fontSize: 14,
		marginBottom: 7,
	},
	inputRow: {
		alignItems: 'center',
		borderColor: COLORS.border,
		borderRadius: 6,
		borderWidth: 1,
		flexDirection: 'row',
		minHeight: 46,
		paddingHorizontal: 12,
	},
	input: {
		color: COLORS.text,
		flex: 1,
		fontSize: 16,
		paddingVertical: 8,
	},
	suffix: {
		color: COLORS.textSecondary,
		fontSize: 13,
		marginLeft: 8,
	},
	switchRow: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		minHeight: 48,
	},
	switchLabel: {
		color: COLORS.text,
		flex: 1,
		fontSize: 14,
		paddingRight: 12,
	},
	separator: {
		backgroundColor: COLORS.border,
		height: 1,
		marginVertical: 8,
	},
	saveButton: {
		alignItems: 'center',
		backgroundColor: COLORS.primary,
		borderRadius: 6,
		minHeight: 48,
		justifyContent: 'center',
		marginTop: 2,
	},
	saveButtonText: {
		color: COLORS.surface,
		fontSize: 16,
		fontWeight: '600',
	},
	resetButton: {
		alignItems: 'center',
		minHeight: 44,
		justifyContent: 'center',
		marginTop: 6,
	},
	resetButtonText: {
		color: COLORS.primary,
		fontSize: 14,
		fontWeight: '600',
	},
	note: {
		color: COLORS.textSecondary,
		fontSize: 12,
		lineHeight: 18,
		marginTop: 8,
		textAlign: 'center',
	},
});
