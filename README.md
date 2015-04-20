# Travelpayouts datepicker
## Installation
```
bower install tp-datepicker --save
```
## Custom themes
- default
```
@import 'bower_components/tp-datepicker/app/styles/main';
```
- airbnb
```
@import 'bower_components/tp-datepicker/app/styles/themes/airbnb';
```

Or change variables

```
$tpDatepickerBrandColor: #ff8e00 !default;
$tpDatepickerSecondColor: #78b935 !default;
$tpDatepickerBackgroundColor: #fff !default;
$tpDatepickerHolidaysColor: #f4511e !default;
$tpDatepickerDisabledColor: #C0C0C0 !default;
$tpDatepickerRangeColor: #f5f5f5 !default;
$tpDatepickerBorderActive: 1px solid $tpDatepickerBrandColor !default;
$tpDatepickerNonContrastColor: #eee !default;
$tpDatepickerPrevDatesVisibility: hidden !default;
$tpDatepickerNextDatesDisplay: none !default;
$tpDatepickerBorderWidth: 3px !default;
$tpDatepickerBorder: $tpDatepickerBorderWidth solid $tpDatepickerBrandColor !default;
$tpDatepickerBoxShadow: none !default;

```
## Custom scripts
Only simple datepicker without modules
```
<script src="bower_components/tp-datepicker/dist/scripts/localizations/[ru|en].js"></script>
<script src="bower_components/tp-datepicker/dist/scripts/month_renderer.js"></script>
<script src="bower_components/tp-datepicker/dist/scripts/popup_renderer.js"></script>
<script src="bower_components/tp-datepicker/dist/scripts/datepicker.js"></script>
```
Range datepicker:
```
<script src="bower_components/tp-datepicker/dist/scripts/datepicker_range.js"></script>
```
Modules:
- Swipe detection
```
<script src="bower_components/tp-datepicker/dist/scripts/modules/swipe_detector.js"></script>
```
- Position manager
```
<script src="bower_components/tp-datepicker/dist/scripts/modules/position_manager.js"></script>
```
## Demo
[http://kosyanmedia.github.io/tp-datepicker/](http://kosyanmedia.github.io/tp-datepicker/)
