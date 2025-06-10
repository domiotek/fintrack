import { BreakpointObserver } from '@angular/cdk/layout';
import { Chart, registerables } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Component, ElementRef, inject, input, OnChanges, OnInit, SimpleChanges, viewChild } from '@angular/core';
import { Stats } from '../../../core/models/statistics/stats.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnInit, OnChanges {
  containerBody = viewChild.required<ElementRef>('containerBody');

  chartCanvas = viewChild.required<ElementRef>('chartCanvas');

  private readonly observer = inject(BreakpointObserver);

  chartData = input.required<Stats>();

  tooltipLabel = input.required<string>();

  chart: any;

  ngOnInit(): void {
    Chart.register(...registerables, annotationPlugin);
    this.generateChart();

    const phoneObserver = this.observer.observe('(max-width: 430px)');
    const smallScreenObserver = this.observer.observe('(max-width: 768px)');
    const mediumScreenObserver = this.observer.observe('(max-width: 1024px)');

    combineLatest([phoneObserver, smallScreenObserver, mediumScreenObserver]).subscribe(
      ([phoneScreen, smallScreen, mediumScreen]) => {
        if (smallScreen.matches || mediumScreen.matches || phoneScreen.matches) {
          this.chart.resize();
          this.setChartWidth();
        }
      },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      this.chart.destroy();
      this.generateChart();
    }
  }

  private generateChart(): void {
    const minY = 0;
    const maxY = Math.max(...this.chartData().data) * 1.1;

    const ctx = this.chartCanvas().nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartData().labels,
        datasets: [
          {
            label: this.tooltipLabel(),
            data: this.chartData().data,
            backgroundColor: (context: any) => {
              const bgColor = ['rgba(25,55,109, 0.4)', 'rgba(25,55,109, 0.15)'];

              if (!context.chart.chartArea) {
                return;
              }

              const {
                ctx,
                _,
                chartArea: { top, bottom },
              } = context.chart;
              const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
              gradientBg.addColorStop(0, bgColor[0]);
              gradientBg.addColorStop(1, bgColor[1]);

              return gradientBg;
            },
            pointHoverBackgroundColor: 'rgba(25,55,109, 1)',
            borderColor: 'rgba(25,55,109, 1)',
            borderWidth: 1,
            pointRadius: 4,
            fill: true,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animations: {
          tension: {
            duration: 2000,
            easing: 'linear',
            from: 0.4,
            to: 0,
            loop: true,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            type: 'linear',
            min: minY,
            max: maxY,
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    this.setChartWidth();
  }

  private setChartWidth(): void {
    const totalLabels = this.chartData().labels.length;

    if (window.innerWidth >= 1024) {
      if (totalLabels > 150) {
        const newWidth = (totalLabels - 150) * 10;
        this.containerBody().nativeElement.style.width = `calc(100% + ${newWidth}px)`;
      }
    } else if (window.innerWidth >= 768) {
      if (totalLabels > 100) {
        const newWidth = (totalLabels - 100) * 15;
        this.containerBody().nativeElement.style.width = `calc(100% + ${newWidth}px)`;
      }
    } else if (totalLabels > 50) {
      const newWidth = (totalLabels - 50) * 20;
      this.containerBody().nativeElement.style.width = `calc(100% + ${newWidth}px)`;
    }
  }
}
