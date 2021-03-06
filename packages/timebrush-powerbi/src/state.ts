/*
 * Copyright (c) Microsoft
 * All rights reserved.
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
    HasSettings,
    instanceColorSetting as coloredInstances,
    IColoredObject,
    colorSetting as color,
    numberSetting as num,
    boolSetting as bool,
    gradientSetting as gradient,
    enumSetting,
    GradientSettings,
    settings,
    textSetting as text,
    jsonSetting,
} from "@essex/visual-settings";
import { fullColors } from "@essex/visual-styling";

import { IColorSettings, ColorMode } from "./models";
import { YAxisSettings } from "./settings";
import { dataSupportsDefaultColor, dataSupportsColorizedInstances, dataSupportsGradients } from "./dataConversion";

// Defined in webpack
declare var BUILD_VERSION: string;

/**
 * Represents the state of the timebrush
 */
export default class TimeBrushVisualState extends HasSettings implements IColorSettings {

    @color({
        category: "Data Point",
        displayName: "Bar Color",
        description: "Bar color",
        defaultValue: fullColors[0],
        enumerable: (s, dv) => dataSupportsDefaultColor(dv),
    })
    public defaultBarColor: string;

    /**
     * The colors to use for each of the series
     */
    @coloredInstances<TimeBrushVisualState>({
        category: "Data Point",
        name: "fill",
        defaultValue: (idx) => fullColors[idx] || "#ccc",
        enumerable: (s, dv) => dataSupportsColorizedInstances(dv) && !s.useGradient,
    })
    public seriesColors: IColoredObject[];

    /**
     * Represents the color mode to use
     */
    @enumSetting<TimeBrushVisualState>(ColorMode, {
        category: "Data Point",
        displayName: "Color Mode",
        defaultValue: ColorMode.Instance,
        enumerable: (s, dv) => dataSupportsColorizedInstances(dv),
        description: "Determines how the individual bars within the time brush are colored",
    })
    public colorMode: ColorMode;

    /**
     * Whether or not to clear the selection when the data has changed
     */
    @bool({
        category: "Selection",
        displayName: "Clear selection after data changed",
        name: "clearSelectionAfterDataChange",
        description: "Setting this to true will clear the selection after the data is changed",
        defaultValue: true,
    })
    public clearSelectionOnDataChange: boolean;

    /**
     * The set of gradient settings
     */
    @gradient<TimeBrushVisualState>({
        category: "Data Point",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
    })
    public gradient: GradientSettings;

    /**
     * If the order of the bars in the display should be reversed
     */
    @bool({
        category: "Display",
        displayName: "Reverse Bar Order",
        description: "If true, the bar display order will be reversed",
        defaultValue: false,
    })
    public reverseBars: boolean;

    /**
     * Show / Hide the legend
     */
     @bool({
        category: "Legend",
        displayName: "Legend",
        description: "If true, the legend will be displayed",
        defaultValue: false,
    })
    public showLegend: boolean;


    /**
     * Legend Size
     */
     @num({
        category: "Legend",
        displayName: "Font Size",
        description: "Font Size",
        defaultValue: 10,
        min: 5,
        max: 50,
    })
    public legendFontSize: number;


    /**
     * The size of the bars
     */
    @num({
        category: "Display",
        displayName: "Bar Width",
        description: "The size of the bars",
        defaultValue: 2,
        min: .01,
        max: 100,
    })
    public barWidth: number;

    /**
     * The settings for the Y axis
     */
    @settings(YAxisSettings, {
        category: "Y-Axis",
    })
    public yAxisSettings: YAxisSettings;

    /**
     * If we are being rendered horizontally
     */
    @text({
      persist: false,
      category: "General",
      displayName: "Version",
      description: "The version of TimeBrush",
      compose: () => BUILD_VERSION,
    })
    public version?: string;

    /**
     * The selected time range
     */
    public selectedRange: [Date, Date];

    /**
     * A utility property to indicate if the Gradient color mode is selected
     */
    public get useGradient() {
        return this.colorMode === ColorMode.Gradient;
    }

}
