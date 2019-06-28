<template>
	<!-- Inputs to Open Modal -->
	<div id="datepicker" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">

					<!-- Display Modal Buttons -->
					<div class="modal-actions col-12 p-2">

						<!-- Close Button -->
						<button type="button" class="close" @click.prevent="closeModal()" v-if="showClose">
							<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="15" class="svg-inline--fa fa-times">
								<path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path>
							</svg>
						</button>

						<div class="title">{{ title }}</div>

						<!-- Clear Button -->
						<div class="clear" @click.prevent="clear()" v-if="showClear">Clear</div>

					</div>

					<!-- Display Selected Dates -->
					<div class="modal-date-selection col-12 p-0">

						<!-- Date 1 Selection -->
						<div class="date-selection-1"
							 :class="{ 'active': activeDate === 'date1' , 'null': date1 === null }"
							 @click="setActiveDate('date1')">
							{{ date1 ? date1.slice(0, -4) : placeholders.date1 }}
						</div>

						<!-- Arrow between selections -->
						<div class="arrow" v-if="!singleDate">
							<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" class="svg-inline--fa fa-arrow-right">
								<path fill="currentColor" d="M218.101 38.101L198.302 57.9c-4.686 4.686-4.686 12.284 0 16.971L353.432 230H12c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h341.432l-155.13 155.13c-4.686 4.686-4.686 12.284 0 16.971l19.799 19.799c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L235.071 38.101c-4.686-4.687-12.284-4.687-16.97 0z" class=""></path>
							</svg>
						</div>

						<!-- Date 2 Selection -->
						<div class="date-selection-2"
							 :class="{ 'active': activeDate === 'date2', 'null': date2 === null }"
							 @click="setActiveDate('date2')"
							 v-if="!singleDate">
							{{ date2 ? date2.slice(0, -4) : placeholders.date2 }}
						</div>

					</div>

					<!-- Display Day Names -->
					<div class="day-names">
						<div class="day-name" v-for="dayName in dayNames">{{ dayName }}</div>
					</div>

				</div>
				<div class="modal-body p-0">

					<!-- Calendar List -->
					<calendar :dayNames="dayNames" :min="minDate" :max="maxDate" width="auto" height="auto"></calendar>

				</div>
				<div class="modal-footer" v-if="!autoclose && !singleDate && date1 && date2 || !autoclose && singleDate && date1">
					<button class="btn btn-primary btn-block text-uppercase font-weight-bold p-3" @click="closeModal()">Apply</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Calendar from './components/Calendar.vue'

	export default {
		name: 'app',
		components: {Calendar},
		props: {
			autoclose: {
				type: Boolean,
				default() {
					return true
				}
			},
			showClose: {
				type: Boolean,
				default() {
					return true
				}
			},
			showClear: {
				type: Boolean,
				default() {
					return true
				}
			},
			singleDate: {
				type: Boolean,
				default() {
					return false
				}
			},
			dayNames: {
				type: Array,
				default() {
					return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
				}
			},
			minDate: {
				type: Date,
				default() {
					return new Date()
				}
			},
			maxDate: {
				type: Date,
				default() {
					return new Date(new Date().setFullYear(new Date().getFullYear() + 2))
				}
			},
			maxDatesBetween: {
				type: Number,
				default() {
					return 0
				}
			},
			placeholders: {
				type: Object,
				default() {
					return {'date1': 'Select Date', 'date2': 'Select Date'}
				}
			},
			title: {
				type: String,
				default() {
					return ''
				}
			}
		},
		data() {
			return {
				date1: null,
				dateISO1: null,
				date2: null,
				dateISO2: null,

				activeDate: 'date1',
			}
		},
		mounted() {
			this.$root.$on('date1', (date) => {
				if (date) {

					// Set Date
					this.dateISO1 = date
					this.date1 = date.toDateString();

					// If auto-close and single dates is true, close modal. Otherwise, set date 2 to active.
					if (this.autoclose && this.singleDate) {
						setTimeout(() => {
							this.closeModal();
						}, 300)
					} else {
						this.activeDate = 'date2';
					}
				}
			});

			this.$root.$on('date2', (date) => {
				if (date) {

					// Set Date
					this.dateISO2 = date
					this.date2 = date.toDateString();

					// If auto-close is true, close modal on date 2 selection.
					if (this.autoclose) {
						setTimeout(() => {
							this.closeModal();
						}, 300)
					}

					if (!this.dateISO1) {
						this.activeDate = 'date1';
					} else if (this.dateISO1 && this.dateISO2) {
						this.activeDate = '';
					}

				} else {

					// If no date, null out variables.
					this.date2 = null
					this.dateISO2 = null
				}
			});
		},
		methods: {
			openModal(activeDate = 'date1') {
				this.activeDate = activeDate
				$('#datepicker').modal('show')
			},

			closeModal() {
				this.$emit('update:dates', {date1: this.date1, date2: this.date2})
				$('#datepicker').modal('hide')
			},

			setActiveDate(date) {
				this.activeDate = date
			},

			clear() {
				this.date1 = null;
				this.date2 = null;
				this.dateISO1 = null;
				this.dateISO2 = null;
				this.activeDate = 'date1'
				this.$root.$emit('clearSelected')
			}
		}
	}
</script>


<style lang="scss" scoped>
	#datepicker {
		z-index: 1041;

		.modal-dialog {
			&, .modal-content {
				height: 100vh;
				margin: 0;
				padding: 0;
			}
		}

		.modal-header {
			display: block;
			padding: 0;
			border-bottom: 0;
			box-shadow: 0px 5px 5px 0 #ccc;
			z-index: 1;

			.modal-actions {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.close {
					flex: 1;
					margin-left: 0;
					text-align: left;

					&:focus {
						outline: 0;
						box-shadow: none;
					}
				}

				.title {
					flex: 6;
					display: flex;
					align-items: center;
					justify-content: center;
					min-height: 50px;
					margin: 0;
					font-size: 1rem;
				}

				.clear {
					flex: 1;
					padding: 1rem;
					font-size: 0.75rem;
					font-weight: 600;
					text-transform: uppercase;
				}
			}

			.modal-date-selection {
				position: relative;
				display: flex;

				.date-selection-1, .date-selection-2 {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 50px;
					font-weight: 600;

					&.active {
						color: #34b4f5;
					}
				}

				.date-selection-2 {
					position: relative;
					top: 0;
					left: 0;
					right: calc(100% + 50px);
					width: 100%;

					&.active {
						right: 0;
					}

					&::after {
						content: "";
						position: absolute;
						right: inherit;
						bottom: 0;
						width: inherit;
						height: 4px;
						background: #34b4f5;
						pointer-events: none;
						/*transition*/
						-webkit-transition: all .5s ease;
						-moz-transition: all .5s ease;
						-o-transition: all .5s ease;
						transition: all .5s ease;
					}
				}

				.date-selection-1:not(.active) + .arrow + .date-selection-2:not(.active)::after {
					display: none;
				}

				.arrow {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 50px;
					width: 50px;
				}
			}

			.day-names {
				display: flex;
				align-content: center;
				justify-content: center;
				background-color: #f3f4f5;
				font-weight: 600;
				color: #293f4d;

				.day-name {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 50px;
				}
			}
		}

		.modal-content {
			max-height: initial;
		}

		.modal-body {
			overflow-y: scroll;

			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
</style>