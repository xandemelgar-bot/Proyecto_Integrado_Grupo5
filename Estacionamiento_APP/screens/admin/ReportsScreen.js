import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '../../constants/colors';

const REPORTS = {
	Día: {
		labels: ['8 a.', '10 a.', '12 p.', '2 p.', '4 p.', '6 p.'],
		occupancy: [28, 54, 76, 63, 88, 42],
		usageValues: [35, 55, 80, 65, 110, 40],
		usageLabels: ['35 min', '55 min', '80 min', '65 min', '110 min', '40 min'],
		incomeValues: [22, 38, 65, 53, 48, 19],
		incomeLabels: ['$22 mil', '$38 mil', '$65 mil', '$53 mil', '$48 mil', '$19 mil'],
		usage: '3 h 20 min',
		totalIncome: '$ 245.000',
		average: '58%',
		visits: '34',
		days: [
			{ day: 'Hoy', visits: '34', income: '$ 245.000' },
			{ day: 'Ayer', visits: '29', income: '$ 212.000' },
			{ day: 'Hace 2 días', visits: '31', income: '$ 226.000' },
		],
	},
	Semana: {
		labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
		occupancy: [45, 52, 48, 67, 82, 91, 56],
		usageValues: [120, 145, 130, 170, 190, 210, 135],
		usageLabels: ['120 min', '145 min', '130 min', '170 min', '190 min', '210 min', '135 min'],
		incomeValues: [168, 190, 154, 217, 266, 294, 168],
		incomeLabels: ['$168 mil', '$190 mil', '$154 mil', '$217 mil', '$266 mil', '$294 mil', '$168 mil'],
		usage: '2 h 45 min',
		totalIncome: '$ 1.480.000',
		average: '63%',
		visits: '208',
		days: [
			{ day: 'Lunes', visits: '24', income: '$ 168.000' },
			{ day: 'Martes', visits: '27', income: '$ 190.000' },
			{ day: 'Miércoles', visits: '22', income: '$ 154.000' },
			{ day: 'Jueves', visits: '31', income: '$ 217.000' },
			{ day: 'Viernes', visits: '38', income: '$ 266.000' },
			{ day: 'Sábado', visits: '42', income: '$ 294.000' },
			{ day: 'Domingo', visits: '24', income: '$ 168.000' },
		],
	},
	Mes: {
		labels: ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4'],
		occupancy: [48, 61, 72, 66],
		usageValues: [145, 158, 175, 166],
		usageLabels: ['145 min', '158 min', '175 min', '166 min'],
		incomeValues: [1318, 1456, 1684, 1462],
		incomeLabels: ['$1.318 mil', '$1.456 mil', '$1.684 mil', '$1.462 mil'],
		usage: '2 h 58 min',
		totalIncome: '$ 5.920.000',
		average: '62%',
		visits: '832',
		days: [
			{ day: 'Semana 1', visits: '185', income: '$ 1.318.000' },
			{ day: 'Semana 2', visits: '204', income: '$ 1.456.000' },
			{ day: 'Semana 3', visits: '236', income: '$ 1.684.000' },
			{ day: 'Semana 4', visits: '207', income: '$ 1.462.000' },
		],
	},
};

function Stat({ label, value }) {
	return (
		<View style={styles.stat}>
			<Text style={styles.statLabel}>{label}</Text>
			<Text style={styles.statValue}>{value}</Text>
		</View>
	);
}

function MetricChart({ labels, values, valueLabels, caption }) {
	const highestValue = Math.max(...values);

	return (
		<View>
			<View style={styles.chart}>
				{values.map((value, index) => (
					<View key={labels[index]} style={styles.barGroup}>
						<Text style={styles.barValue}>{valueLabels[index]}</Text>
						<View style={styles.barTrack}>
							<View style={[styles.bar, { height: `${Math.max((value / highestValue) * 100, 8)}%` }]} />
						</View>
						<Text style={styles.barLabel}>{labels[index]}</Text>
					</View>
				))}
			</View>
			<Text style={styles.chartCaption}>{caption}</Text>
		</View>
	);
}

export default function ReportsScreen() {
	const [period, setPeriod] = useState('Semana');
	const report = REPORTS[period];

	return (
		<ScrollView style={styles.screen} contentContainerStyle={styles.content}>
			<Text style={styles.title}>Reportes</Text>
			<Text style={styles.description}>Resumen de actividad e ingresos simulados.</Text>

			<View style={styles.periodSelector}>
				{Object.keys(REPORTS).map((option) => (
					<TouchableOpacity
						key={option}
						onPress={() => setPeriod(option)}
						style={[styles.periodButton, period === option && styles.periodButtonSelected]}
					>
						<Text
							style={[styles.periodText, period === option && styles.periodTextSelected]}
						>
							{option}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<View style={styles.statsGrid}>
				<Stat label="Ocupación promedio" value={report.average} />
				<Stat label="Tiempo promedio" value={report.usage} />
				<Stat label="Ingresos simulados" value={report.totalIncome} />
				<Stat label="Entradas registradas" value={report.visits} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Ocupación</Text>
				<MetricChart
					labels={report.labels}
					values={report.occupancy}
					valueLabels={report.occupancy.map((value) => `${value}%`)}
					caption="Porcentaje de espacios ocupados."
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Tiempo de uso</Text>
				<MetricChart
					labels={report.labels}
					values={report.usageValues}
					valueLabels={report.usageLabels}
					caption="Tiempo promedio de estacionamiento."
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Ingresos simulados</Text>
				<MetricChart
					labels={report.labels}
					values={report.incomeValues}
					valueLabels={report.incomeLabels}
					caption="Montos de ejemplo por periodo, expresados en miles."
				/>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Estadísticas por día</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableHeading, styles.dayColumn]}>Día</Text>
					<Text style={[styles.tableHeading, styles.visitsColumn]}>Entradas</Text>
					<Text style={[styles.tableHeading, styles.incomeColumn]}>Ingresos</Text>
				</View>
				{report.days.map((row) => (
					<View key={row.day} style={styles.tableRow}>
						<Text style={[styles.tableCell, styles.dayColumn]}>{row.day}</Text>
						<Text style={[styles.tableCell, styles.visitsColumn]}>{row.visits}</Text>
						<Text style={[styles.tableCell, styles.incomeColumn]}>{row.income}</Text>
					</View>
				))}
			</View>

			<Text style={styles.note}>
				Los números de esta pantalla son de ejemplo y no representan cobros reales.
			</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: COLORS.background,
		flex: 1,
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
		marginBottom: 18,
	},
	periodSelector: {
		backgroundColor: '#E8EDF4',
		borderRadius: 7,
		flexDirection: 'row',
		marginBottom: 16,
		padding: 4,
	},
	periodButton: {
		alignItems: 'center',
		borderRadius: 5,
		flex: 1,
		justifyContent: 'center',
		minHeight: 40,
	},
	periodButtonSelected: {
		backgroundColor: COLORS.surface,
	},
	periodText: {
		color: COLORS.textSecondary,
		fontSize: 14,
		fontWeight: '500',
	},
	periodTextSelected: {
		color: COLORS.primary,
		fontWeight: '700',
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
		marginBottom: 16,
	},
	stat: {
		backgroundColor: COLORS.surface,
		borderColor: COLORS.border,
		borderRadius: 7,
		borderWidth: 1,
		flexBasis: '48%',
		flexGrow: 1,
		minHeight: 88,
		justifyContent: 'center',
		padding: 14,
	},
	statLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginBottom: 7,
	},
	statValue: {
		color: COLORS.text,
		fontSize: 18,
		fontWeight: '700',
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
		fontSize: 17,
		fontWeight: '600',
		marginBottom: 16,
	},
	chart: {
		alignItems: 'flex-end',
		borderBottomColor: COLORS.border,
		borderBottomWidth: 1,
		flexDirection: 'row',
		height: 176,
		justifyContent: 'space-around',
		paddingTop: 4,
	},
	barGroup: {
		alignItems: 'center',
		flex: 1,
		height: '100%',
		justifyContent: 'flex-end',
		paddingHorizontal: 2,
	},
	barValue: {
		color: COLORS.textSecondary,
		fontSize: 10,
		marginBottom: 4,
	},
	barTrack: {
		backgroundColor: '#E8EDF4',
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		height: 120,
		justifyContent: 'flex-end',
		overflow: 'hidden',
		width: '62%',
	},
	bar: {
		backgroundColor: COLORS.primary,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
		minHeight: 4,
		width: '100%',
	},
	barLabel: {
		color: COLORS.textSecondary,
		fontSize: 10,
		marginTop: 7,
		minHeight: 16,
		textAlign: 'center',
	},
	chartCaption: {
		color: COLORS.textSecondary,
		fontSize: 12,
		marginTop: 12,
	},
	tableHeader: {
		borderBottomColor: COLORS.border,
		borderBottomWidth: 1,
		flexDirection: 'row',
		paddingBottom: 10,
	},
	tableHeading: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontWeight: '600',
	},
	tableRow: {
		borderBottomColor: COLORS.border,
		borderBottomWidth: 1,
		flexDirection: 'row',
		minHeight: 42,
		alignItems: 'center',
	},
	tableCell: {
		color: COLORS.text,
		fontSize: 12,
	},
	dayColumn: {
		flex: 1,
	},
	visitsColumn: {
		textAlign: 'center',
		width: 58,
	},
	incomeColumn: {
		textAlign: 'right',
		width: 106,
	},
	note: {
		color: COLORS.textSecondary,
		fontSize: 12,
		lineHeight: 18,
		textAlign: 'center',
	},
});
