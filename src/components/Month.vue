<template>
	<div class="month" :data-month="month" :data-year="year">
		<div class="month-name">{{monthNames[month]}} {{ year }}</div>
		<div class="week" v-for="week in weeks">
			<Day
					v-for="day in week"
					:day="day"
					:key="day.getTime()"
					:isSelected="isSelected(day)"
			/>
		</div>
	</div>
</template>

<script>
	import Day from './Day.vue'

	export default {
		components: {
			Day
		},
		computed: {
			weeks() {
				let monthWeeks = []
				let firstDate = new Date(this.year, this.month, 1)
				let lastDate = new Date(this.year, this.month + 1, 1)
				let currentWeekDay = 0
				let currentWeek = []
				let adjustDays = 2

				// Adjust days for specific months that start on a Wednesday.
				if(new Date(this.year, this.month, 1).getDay() === 3){
					adjustDays = 1
				}

				// Add days from previous month
				if (this.firstDay !== firstDate.getDay() - adjustDays) {
					let previousDate = new Date(this.year, this.month, 0)
					while (previousDate.getDay() !== this.firstDay - 1) {
						previousDate.setDate(previousDate.getDate() - 1)
					}
					while (previousDate.getTime() !== firstDate.getTime()) {
						const day = new Date(previousDate.getTime())
						if(previousDate.getTime() == day) {
							currentWeek.push(day)
						}
						currentWeekDay += 1
						previousDate.setDate(previousDate.getDate() + 1)
					}
				}

				// Add days from current month
				while (firstDate.getTime() !== lastDate.getTime()) {
					const day = new Date(firstDate.getTime())
					if (currentWeekDay === 7) {
						monthWeeks.push(currentWeek)
						currentWeekDay = 0
						currentWeek = []
					}
					currentWeek.push(day)
					currentWeekDay += 1
					firstDate.setDate(firstDate.getDate() + 1)
				}

				// Add days of next month (Removed for now)
				if (currentWeek.length > 0) {
					// while (currentWeek.length !== 7) {
					// 	const day = new Date(firstDate.getTime())
					// 	currentWeek.push(day)
					// 	firstDate.setDate(firstDate.getDate() + 1)
					// }
					monthWeeks.push(currentWeek)
				}

				return monthWeeks
			}
		},
		methods: {
			isSelected(date) {
				const isoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
				return this.selectedDates.indexOf(isoDate) !== -1
			}
		},
		props: {
			monthNames: {
				type: Array,
				required: true
			},
			month: {
				type: Number,
				required: true
			},
			year: {
				type: Number,
				required: true
			},
			firstDay: {
				type: Number,
				required: true
			},
			selectedDates: {
				type: Array,
				required: true
			}
		}
	}
</script>

<style lang="scss">
	.week {
		display: flex;
		justify-content: flex-end;
		width: 100%;

		& .day.is-selected:only-of-type{
			background-color: #333;
		}

		&:last-child{
			justify-content: flex-start;
		}
	}

	.month {
		position: relative;
		.month-name {
			text-align: center;
			font-weight: 400;
			padding-top: 15px;
			margin-bottom: 5px;
			color: #333;
		}
	}
</style>
