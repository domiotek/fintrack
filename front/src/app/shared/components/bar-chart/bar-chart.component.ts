import { Component, ElementRef, input, OnChanges, OnInit, SimpleChanges, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Stats } from '../../../core/models/statistics/stats.model';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, OnChanges {
  containerBody = viewChild.required<ElementRef>('containerBody');

  chartCanvas = viewChild.required<ElementRef>('chartCanvas');

  chartData = input.required<Stats>();

  tooltipLabel = input.required<string>();

  color = input<string>('rgba(25,55,109)');

  chart: any;

  ngOnInit(): void {
    Chart.register(...registerables, annotationPlugin);
    this.generateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chart) {
      this.chart.destroy();
      this.generateChart();
    }
  }

  generateChart(): void {
    const maxY = Math.max(...this.chartData().data) * 1.1;

    const ctx = this.chartCanvas().nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.chartData().labels,
        datasets: [
          {
            label: this.tooltipLabel(),
            data: this.chartData().data,
            backgroundColor: this.color(),
            borderRadius: 5,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onHover: (event: any, chartElement: any) => {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        scales: {
          y: {
            beginAtZero: false,
            type: 'linear',
            min: 0,
            max: maxY,
          },
        },
      },
    });
  }
}
