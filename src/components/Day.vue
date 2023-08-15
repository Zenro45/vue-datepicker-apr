<template>
	<div :class="{
			day: true,
			'is-today': isToday(day),
			'is-between': isBetweenDates(day),
			'is-selected': selected,
			'is-preselected': preSelected,
			'rounded': selected && $parent.$parent.$parent.$parent.singleDate,
			'disabled': isBeforeToday(day) || isAfterDaysOfSelection(day) || isBeforeMinDate(day) || isAfterMaxDate(day),
			'hide': isNotMonth(day)
		}"
		 @click="handleClick(day)">
		{{day.getDate()}}
	</div>
</template>

<script>
	export default {
		methods: {
			handleClick(day) {

				if (!this.isBeforeToday(day)) {

					// If date is after final date throw an alert
					if(this.isBeforeDay(day)){
						alert('You cannot select a date after the final date.')
						return
					}

					// Prevent click on disabled dates.
					if($(this.$el).hasClass('disabled')){ return }


					// Check to see which date is active
					if (this.$parent.$parent.$parent.$parent.activeDate === 'date1'
						|| $('#datepicker_' + this.variable + ' .is-selected').length >= 2
						|| (this.$parent.$parent.$parent.$parent.activeDate === 'date1' && this.isBeforeDay(this.$parent.$parent.$parent.$parent.dateISO2))) {

						// If date 1 exists null out date2 else set date 1
						if (this.$parent.$parent.$parent.$parent.date1) {
							this.$root.$emit(this.variable + '_clearSelected')
							this.$root.$emit(this.variable + '_date1', day);
							this.$root.$emit(this.variable + '_date2', null);
						} else {
							this.$root.$emit(this.variable + '_date1', day);
						}

					} else if (this.$parent.$parent.$parent.$parent.activeDate === 'date2') {

						if (this.$parent.$parent.$parent.$parent.singleDate) {
							this.$root.$emit(this.variable + '_clearSelected')
							this.$root.$emit(this.variable + '_date1', day);

							// If date 2 is before date 1, set date 1 instead.
						} else if (this.isSecondDateValid(day)) {
							this.$root.$emit(this.variable + '_date2', day);

						} else {
							this.$root.$emit(this.variable + '_clearSelected')
							this.$root.$emit(this.variable + '_date1', day);
						}

					}

					this.selected = true
				}
			},

			isSecondDateValid(day) {
				const date1 = this.$parent.$parent.$parent.$parent.dateISO1;
				
				if (this.$parent.$parent.$parent.$parent.allowSameDate) {
					return (new Date(date1).getTime() <= new Date(day).getTime());
				}
				
				return (new Date(date1).getTime() < new Date(day).getTime());
			},

			isBetweenDates(day = this.day) {
				if (this.$parent.$parent.$parent.$parent.date1 && this.$parent.$parent.$parent.$parent.date2) {
					let date1 = new Date(this.$parent.$parent.$parent.$parent.dateISO1);
					let date2 = new Date(this.$parent.$parent.$parent.$parent.dateISO2);
					if (date1 < day && date2 > day) {
						return true
					}
				}
			},

			isBeforeToday(day = this.day) {
				let today = this.$parent.$parent.$parent.$parent.minDate
				return (
					day.getFullYear() === today.getFullYear() &&
					day.getMonth() === today.getMonth() &&
					day.getDate() < today.getDate()
				) || (
					day.getFullYear() === today.getFullYear() &&
					day.getMonth() < today.getMonth()
				)
			},

			isBeforeMinDate(day = this.day) {
				let min = this.$parent.$parent.$parent.min
				if (min) {
					let date = new Date(min);
					date.setDate(date.getDate() - 1);
					return (day < date)
				}
			},

			isAfterMaxDate(day = this.day) {
				let max = this.$parent.$parent.$parent.max
				if (max) {
					let date = new Date(max);
					return (day > date)
				}
			},

			isBeforeDay(day = this.day) {
				if(this.$parent.$parent.$parent.$parent.dateISO2 && !this.$parent.$parent.$parent.$parent.dateISO1 && !this.$parent.$parent.$parent.$parent.singleDate) {
					let selectedDay = new Date(this.$parent.$parent.$parent.$parent.dateISO2)
					return (day.getMonth() >= selectedDay.getMonth() &&
						day.getDate() > selectedDay.getDate())
				}
			},

			isNotMonth(day = this.day) {
				let today = new Date()
				let min = new Date(this.$parent.$parent.$parent.min)
				if (min >= today){
					return (
						day.getFullYear() === today.getFullYear() &&
						day.getMonth() < today.getMonth()
					)
				}
			},

			isAfterDaysOfSelection(day) {
				let dateISO1 = this.$parent.$parent.$parent.$parent.dateISO1
				let maxDatesBetween = this.$parent.$parent.$parent.$parent.maxDatesBetween
				if (dateISO1 && maxDatesBetween) {
					let date = new Date(dateISO1);
					let afterSelection = date.setDate(date.getDate() + 30);
					return (day > afterSelection)
				}
			},

			isToday(day = this.day) {
				let today = new Date()
				return day.getFullYear() === today.getFullYear() &&
					day.getMonth() === today.getMonth() &&
					day.getDate() === today.getDate()
			},
		},
		computed: {},
		mounted() {
			this.$root.$on(this.variable + '_sessionDates', (dates) => {

				if( this.day.getFullYear() === new Date(dates.dateISO1).getFullYear() &&
					this.day.getMonth() === new Date(dates.dateISO1).getMonth() &&
					this.day.getDate() === new Date(dates.dateISO1).getDate() ) {
					this.selected = true
				}
				if(!this.$parent.$parent.$parent.$parent.singleDate) {
					if (this.day.getFullYear() === new Date(dates.dateISO2).getFullYear() &&
						this.day.getMonth() === new Date(dates.dateISO2).getMonth() &&
						this.day.getDate() === new Date(dates.dateISO2).getDate()) {
						this.selected = true
					}
				}

				if(this.$parent.$parent.$parent.min) {
					let minDate = new Date(this.$parent.$parent.$parent.min);
					if (this.day.getFullYear() === minDate.getFullYear() &&
						this.day.getMonth() === minDate.getMonth() &&
						this.day.getDate() === minDate.getDate() &&
						this.day.getDate() !== new Date().getDate()
					) {
						if(this.$parent.$parent.$parent.preSelectMin)
						this.preSelected = true
					}
				}
			})

			this.$root.$on(this.variable + '_clearSelected', () => {
				$('#datepickerModal .is-between').removeClass('is-between')
				this.selected = false
			})
		},
		data() {
			return {
				parent: null,
				selected: false,
				preSelected: false,
				variable: this.$parent.$parent.$parent.$parent.variable
			}
		},
		props: {
			day: {
				type: Date,
				required: true
			},
			isSelected: {
				type: Boolean,
				required: true
			}
		}
	}
</script>
