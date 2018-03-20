# Timeline API

This file will load all the Javascript files necessary to make the standard timeline work.
It also detects the default locale.

To run Timeline directly from the www.simile-widgets.org server include this fragment in your HTML file as follows:

```html
  <script src="http://api.simile-widgets.org/timeline/2.3.1/timeline-api.js"
   type="text/javascript"></script>
```

## Host on your own server

To host the Timeline files on your own server:

1) Install the Timeline files onto your webserver using
   the minimal distribution "timeline_<version>_minimal.(zip|tar.gz)" found at

       http://code.google.com/p/simile-widgets/downloads/list

2) Set the following global js variable used to send parameters to this script:

-    `var Timeline_ajax_url`  -- URL for simile-ajax-api.js
-    `var Timeline_urlPrefix` -- URL for the *directory* that contains timeline-api.js on your web site (including the trailing slash!)

For example your HTML page would include:

```html
  <script>
    var Timeline_ajax_url="http://YOUR_SERVER/apis/timeline/ajax/simile-ajax-api.js";
    var Timeline_urlPrefix='http://YOUR_SERVER/apis/timeline/';
  </script>
  <script src="http://YOUR_SERVER/javascripts/timeline/timeline-api.js" type="text/javascript"></script>
```

## SCRIPT PARAMETERS

This script auto-magically figures out locale and has defaults for other parameters To set parameters explicity, set js global variable Timeline_parameters or include as parameters on the url using GET style. Eg the two next lines pass the same parameters:

```javascript
Timeline_parameters='bundle=true';                    // pass parameter via js variable
<script src="http://....timeline-api.js?bundle=true"  // pass parameter via url
```

### Parameters:

-   timeline-use-local-resources --
-   bundle -- true: use the single js bundle file; false: load individual files (for debugging)
-   locales --
-   defaultLocale --
-   forceLocale -- force locale to be a particular value--used for debugging. Normally locale is determined
                 by browser's and server's locale settings.

## DEBUGGING

If you have a problem with Timeline, the first step is to use the unbundled Javascript files. To do so use the unbundled Timeline and Ajax libraries

Change

```html
<script src="http://api.simile-widgets.org/timeline/2.3.1/api/timeline-api.js?bundle=true" type="text/javascript"></script>
```

To

```html
  <script>var Timeline_ajax_url = "http://api.simile-widgets.org/ajax/2.2.1/simile-ajax-api.js?bundle=false"</script>
  <script src="http://api.simile-widgets.org/timeline/2.3.1/api/timeline-api.js?bundle=false" type="text/javascript"></script>
```

Note that the Ajax version is usually NOT the same as the Timeline version.

See variable simile_ajax_ver below for the current version