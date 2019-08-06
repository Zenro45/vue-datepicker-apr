<template>
	<div class="vue-infinite-calendar">
		<div class="calendar-header" :style="{width: width}">
			<a href="javascript:void(0)" class="today-button" v-if="displayToday" @click="scrollToDate(new Date())">↪Today</a>
		</div>
		<div class="calendar-container" :style="{width: width, height: height}" @scroll="handleScroll">
			<MonthList
					:months="months"
					:monthNames="monthNames"
					:firstDay="firstDay"
					:selectedDates="selectedDates"
			/>
		</div>
	</div>
</template>

<script>
	import MonthList from './MonthList.vue'

	export default {
		components: {
			MonthList
		},
		data() {
			return {
				currentYear: new Date().getFullYear(),
			}
		},
		computed: {
			weekdays() {
				let weekDays = []
				let firstDay = this.firstDay
				while (weekDays.length !== 7) {
					weekDays.push(this.dayNames[firstDay])
					firstDay += 1
					if (firstDay >= this.dayNames.length) {
						firstDay = 1
					}
				}
				return weekDays
			},
			months() {
				let month = this.min.getMonth()
				let year = this.min.getFullYear()
				let currentDate = this.min
				let displayedMonths = []

				while (currentDate.getTime() < this.max.getTime()) {
					displayedMonths.push({year: year, month: month})
					month += 1
					if (month >= 12) {
						year += 1
						month -= 12
					}
					currentDate = new Date(year, month)
				}
				return displayedMonths
			},
			headerHeight() {
				return this.$el.querySelector('.calendar-header').getBoundingClientRect().height
			}
		},
		created() {
			this.selected.forEach((date) => {
				const isoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
				this.selectedDates.push(isoDate)
			})
		},
		mounted() {
			this.scrollToDate(this.min)
		},
		props: {
			selected: {
				type: Array,
				default() {
					return []
				}
			},
			selectedDates: {
				type: Array,
				default() {
					return []
				}
			},
			min: {
				type: Date,
				default() {
					return new Date(1980, 0, 1)
				}
			},
			max: {
				type: Date,
				default() {
					return new Date(2050, 11, 31)
				}
			},
			width: {
				type: String,
				default: '300px'
			},
			height: {
				type: String,
				default: '500px'
			},
			monthNames: {
				type: Array,
				default() {
					return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
				}
			},
			dayNames: {
				type: Array,
				default() {
					return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
				}
			},
			displayToday: {
				type: Boolean,
				default() {
					return false
				}
			},
			firstDay: {
				type: Number,
				default: 1 // Monday
			},
		},
		methods: {
			scrollToDate(date) {
				const month = date.getMonth()
				const year = date.getFullYear()
				this.scrollToMonth(year, month)
			},
			scrollToMonth(year, month) {
				const headerHeight = this.headerHeight
				if(this.$el.querySelector(`.month[data-month="${month}"][data-year="${year}"]`)) {
					setTimeout(() => {
						if(this.$el) {
							const offset = this.$el.querySelector(`.month[data-month="${month}"][data-year="${year}"]`).offsetTop
							$(".modal-body").animate({scrollTop: offset - headerHeight}, "slow");
						}
					}, 500)
				}
			},
			handleScroll(e) {
				const headerHeight = this.headerHeight
				if(this.$el.querySelector('.calendar-container')) {
					const scrollTop = this.$el.querySelector('.calendar-container').scrollTop
					const years = this.$el.querySelectorAll('.year')
					for (let i = 0; i < years.length; i++) {
						const year = years[i]
						if (scrollTop <= year.offsetTop - (headerHeight - 10)) {
							if (i !== 0) {
								this.currentYear = Number(year.innerHTML) - 1
							}
							return
						}
					}
				}
				this.currentYear = this.max.getFullYear()
			}
		}
	}
</script>

<style lang="scss">
	.vue-infinite-calendar {
		position: relative;
	}

	.calendar-container {
		position:relative;
		overflow: scroll;
		margin: 0 auto;
		padding-bottom: 5rem;
		-webkit-overflow-scrolling: touch;
		box-shadow: inset 0px 10px 10px -10px #CCC, inset 0px -10px 10px -10px #CCC;
	}

	.week-names {
		display: flex;
		align-items: center;
		justify-content: center;

		.day-name {
			flex: 1;
		}
	}

	.calendar-header {
		background-color: white;
		width: inherit;
		margin: 0 auto;

		.current-year {
			font-size: 1.5rem;
		}

		.today-button {
			float: right;
			text-decoration: none;
		}

		.week-days {
			width: 100%;
			margin-bottom: 5px;

			.week-day {
				display: inline-block;
				width: 14.28571%;
				text-align: center;
			}
		}
	}
</style>
