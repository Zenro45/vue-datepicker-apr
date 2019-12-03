<template>
	<div class="month-list">
		<template v-for="month in months">
			<div class="year" v-if="month.month === 0">{{month.year}}</div>
			<Month
					:month="month.month"
					:year="month.year"
					:monthNames="monthNames"
					:firstDay="firstDay"
					:selectedDates="selectedDates"
			/>
		</template>
	</div>
</template>

<script>
	import Month from './Month.vue'

	export default {
		components: {
			Month
		},
		props: {
			months: {
				type: Array,
				required: true
			},
			monthNames: {
				type: Array,
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
