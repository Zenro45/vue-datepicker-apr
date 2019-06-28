<template>
	<div :class="{
			day: true,
			'is-today': isToday(day),
			'is-between': isBetweenDates(day),
			'is-selected': selected,
			'disabled': isBeforeToday(day) || isAfterDaysOfSelection(day),
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
						|| $('#datepicker .is-selected').length >= 2
						|| (this.$parent.$parent.$parent.$parent.activeDate === 'date1' && this.isBeforeDay(this.$parent.$parent.$parent.$parent.dateISO2))) {

						// If date 1 exists null out date2 else set date 1
						if (this.$parent.$parent.$parent.$parent.date1) {
							this.$root.$emit('clearSelected')
							this.$root.$emit('date1', day);
							this.$root.$emit('date2', null);
						} else {
							this.$root.$emit('date1', day);
						}

					} else if (this.$parent.$parent.$parent.$parent.activeDate === 'date2') {

						if (this.$parent.$parent.$parent.$parent.singleDate) {
							this.$root.$emit('clearSelected')
							this.$root.$emit('date1', day);

							// If date 2 is before date 1, set date 1 instead.
						} else if (new Date(this.$parent.$parent.$parent.$parent.dateISO1).getTime() < new Date(day).getTime()) {
							this.$root.$emit('date2', day);
						} else {
							this.$root.$emit('clearSelected')
							this.$root.$emit('date1', day);
						}

					}

					this.selected = true
				}
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
				let today = new Date()
				return (
					day.getFullYear() === today.getFullYear() &&
					day.getMonth() === today.getMonth() &&
					day.getDate() < today.getDate()
				) || (
					day.getFullYear() === today.getFullYear() &&
					day.getMonth() < today.getMonth()
				)
			},

			isBeforeDay(day = this.day) {
				let today = new Date()
				if(this.$parent.$parent.$parent.$parent.dateISO2 && !this.$parent.$parent.$parent.$parent.dateISO1) {
					return day.getDate() > new Date(this.$parent.$parent.$parent.$parent.dateISO2).getDate()
				}
			},

			isNotMonth(day = this.day) {
				let today = new Date()
				return (
					day.getFullYear() === today.getFullYear() &&
					day.getMonth() < today.getMonth()
				)
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
			this.selected = this.isSelected

			this.$root.$on('clearSelected', () => {
				$('#datepickerModal .is-between').removeClass('is-between')
				this.selected = false
			})
		},
		data() {
			return {
				selected: false
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

<style lang="scss">
	.day {
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(100vw/7);
		width: calc(100vw/7);
		font-weight: 600;
		line-height: 43px;
		text-align: center;
		cursor: pointer;
		transition: 0.125s all ease-in-out;
		&:not(.is-between) + .day.is-selected{
			border-radius: 5px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}

	/*.day.is-today {*/
	/*	background-color: blanchedalmond;*/
	/*}*/

	.day.is-between {
		background-color: #7dd3ff;
		color: white;
		& + .day.is-selected{
			border-radius: 5px;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;

		}
	}

	.day.is-selected {
		border-radius: 5px;
		background-color: #34b4f5;
		color: white;

	}

	.day.disabled {
		color: lightgrey;
	}

	.day.hide {
		color: transparent;
	}
</style>
