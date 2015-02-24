<?php
require("lib/generalConfiguration.php");
?>
<!DOCTYPE html>
<html  lang="tr-TR">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/colorpicker/colorpicker.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/jquery.timepicker/jquery-ui-timepicker-addon.css" />
        <link rel="stylesheet" href="css/settings.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/anims.css"/>

        <script>
            var user_id = <?php echo $uid; ?>;
            var user_name = '<?php echo $_SESSION['kullanici']; ?>';
            var lang_array = <?php echo json_encode($langArr); ?>;

            dateLang = {tr: {
                    closeText: 'Kapat',
                    prevText: '&#x3c;geri',
                    nextText: 'ileri&#x3e;',
                    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                        'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                    dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                    currentText: 'Güncel Zaman',
                    timeOnlyTitle: 'Zamanı Seçin',
                    timeText: 'Zaman',
                    hourText: 'Saat',
                    minuteText: 'Dakika',
                    weekHeader: 'Hf',
                },
                en: {}
            };

            highchartsLang = {tr: {
                    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağs', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                    downloadJPEG: 'JPEG olarak kaydet',
                    loading: 'Yükleniyor',
                    downloadPDF: 'PDF olarak kaydet',
                    downloadPNG: 'PNG olarak kaydet',
                    downloadSVG: 'SVG olarak kaydet',
                    exportButtonTitle: 'Vektör veya resim formatında kaydet',
                    printButtonTitle: 'Grafiği yazdır',
                    rangeSelectorFrom: '',
                    rangeSelectorTo: '-',
                    rangeSelectorZoom: 'Aralık:'
                },
                en: {}
            };
        </script>

        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/colorpicker/jscolor.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/highstock-1.3.1/highstock.js"></script>
        <script src="js/moment/moment.min.js"></script>
        <script src="js/jquery.scrollTo-1.4.3.1/jquery.scrollTo-1.4.3.1-min.js"></script>
        <script src="js/jquery.mousewheel/jquery.mousewheel.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/modules/settings.js"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>
        <script src="js/jquery.timepicker/jquery-ui-timepicker-addon.js"></script>

    </head>

    <body>

        <div class="settings_container">
            <div class="header container"> 
            </div>

            <div id="main_left_container">
                <div id="name_container">
                    <table id="hor-zebra" class="name_table">
                        <tbody><tr> <th> ID </th> <th> Kullanıcı </th> </tr><tr> 
                                <td>27</td> 
                                <td>a.altintop</td>
                            </tr><tr> 
                                <td>21</td> 
                                <td>acunmedya</td>
                            </tr><tr> 
                                <td>19</td> 
                                <td>acunmtest</td>
                            </tr><tr> 
                                <td>32</td> 
                                <td>ahmet.can</td>
                            </tr><tr> 
                                <td>3</td> 
                                <td>atv</td>
                            </tr><tr> 
                                <td>18</td> 
                                <td>aydin.koyuncu</td>
                            </tr><tr> 
                                <td>69</td> 
                                <td>aysenur.oran</td>
                            </tr><tr> 
                                <td>77</td> 
                                <td>bata</td>
                            </tr><tr> 
                                <td>67</td> 
                                <td>bilal.ozturk</td>
                            </tr><tr> 
                                <td>88</td> 
                                <td>brandclinic</td>
                            </tr><tr> 
                                <td>7</td> 
                                <td>can.tanriyar</td>
                            </tr><tr id="clicked_obj"> 
                                <td>63</td> 
                                <td>cihad.turhan</td>
                            </tr><tr> 
                                <td>102</td> 
                                <td>demo1</td>
                            </tr><tr> 
                                <td>103</td> 
                                <td>demo2</td>
                            </tr><tr> 
                                <td>104</td> 
                                <td>demo3</td>
                            </tr><tr> 
                                <td>1</td> 
                                <td>dogantv</td>
                            </tr><tr> 
                                <td>100</td> 
                                <td>dubaiii</td>
                            </tr><tr> 
                                <td>99</td> 
                                <td>ectoprak</td>
                            </tr><tr> 
                                <td>16</td> 
                                <td>emrah.saglik</td>
                            </tr><tr> 
                                <td>70</td> 
                                <td>ersoy</td>
                            </tr><tr> 
                                <td>9</td> 
                                <td>ersoy.akdemir</td>
                            </tr><tr> 
                                <td>91</td> 
                                <td>fatihkok</td>
                            </tr><tr> 
                                <td>51</td> 
                                <td>foxceo</td>
                            </tr><tr> 
                                <td>40</td> 
                                <td>foxtv</td>
                            </tr><tr> 
                                <td>72</td> 
                                <td>gm</td>
                            </tr><tr> 
                                <td>10</td> 
                                <td>hakan.kirici</td>
                            </tr><tr> 
                                <td>37</td> 
                                <td>hakan.sen</td>
                            </tr><tr> 
                                <td>30</td> 
                                <td>hatice.balci</td>
                            </tr><tr> 
                                <td>53</td> 
                                <td>herseyfilm</td>
                            </tr><tr> 
                                <td>38</td> 
                                <td>ibrahim.sahin</td>
                            </tr><tr> 
                                <td>8</td> 
                                <td>kanal24</td>
                            </tr><tr> 
                                <td>4</td> 
                                <td>kanal7</td>
                            </tr><tr> 
                                <td>43</td> 
                                <td>kanald</td>
                            </tr><tr> 
                                <td>5</td> 
                                <td>kanalturk</td>
                            </tr><tr> 
                                <td>52</td> 
                                <td>kanalturkceo</td>
                            </tr><tr> 
                                <td>101</td> 
                                <td>livedemo1</td>
                            </tr><tr> 
                                <td>95</td> 
                                <td>melik</td>
                            </tr><tr> 
                                <td>93</td> 
                                <td>mepas</td>
                            </tr><tr> 
                                <td>20</td> 
                                <td>murat.keskin</td>
                            </tr><tr> 
                                <td>68</td> 
                                <td>mustafa.demirel</td>
                            </tr><tr> 
                                <td>83</td> 
                                <td>mustafa.parlakyigit</td>
                            </tr><tr> 
                                <td>65</td> 
                                <td>natalija</td>
                            </tr><tr> 
                                <td>78</td> 
                                <td>nevzat.ercolak</td>
                            </tr><tr> 
                                <td>62</td> 
                                <td>nihal.saglam</td>
                            </tr><tr> 
                                <td>96</td> 
                                <td>noktademo</td>
                            </tr><tr> 
                                <td>34</td> 
                                <td>noname</td>
                            </tr><tr> 
                                <td>28</td> 
                                <td>osman.yilmaz</td>
                            </tr><tr> 
                                <td>105</td> 
                                <td>rifat.keser</td>
                            </tr><tr> 
                                <td>48</td> 
                                <td>rtuk</td>
                            </tr><tr> 
                                <td>73</td> 
                                <td>sabit</td>
                            </tr><tr> 
                                <td>98</td> 
                                <td>sakca</td>
                            </tr><tr> 
                                <td>97</td> 
                                <td>saltinbas</td>
                            </tr><tr> 
                                <td>2</td> 
                                <td>sbt</td>
                            </tr><tr> 
                                <td>64</td> 
                                <td>sbttanitim</td>
                            </tr><tr> 
                                <td>94</td> 
                                <td>showceo</td>
                            </tr><tr> 
                                <td>26</td> 
                                <td>showTV</td>
                            </tr><tr> 
                                <td>50</td> 
                                <td>sozkan</td>
                            </tr><tr> 
                                <td>42</td> 
                                <td>star</td>
                            </tr><tr> 
                                <td>6</td> 
                                <td>stv</td>
                            </tr><tr> 
                                <td>80</td> 
                                <td>stv1</td>
                            </tr><tr> 
                                <td>81</td> 
                                <td>stv2</td>
                            </tr><tr> 
                                <td>82</td> 
                                <td>stv3</td>
                            </tr><tr> 
                                <td>17</td> 
                                <td>tahir.yilmaz</td>
                            </tr><tr> 
                                <td>55</td> 
                                <td>taner.ertekin</td>
                            </tr><tr> 
                                <td>92</td> 
                                <td>tkocaman</td>
                            </tr><tr> 
                                <td>49</td> 
                                <td>trt</td>
                            </tr><tr> 
                                <td>44</td> 
                                <td>tv8demo</td>
                            </tr><tr> 
                                <td>45</td> 
                                <td>tyurekli</td>
                            </tr><tr> 
                                <td>90</td> 
                                <td>videodemo</td>
                            </tr><tr> 
                                <td>35</td> 
                                <td>ykilic</td>
                            </tr><tr> 
                                <td>29</td> 
                                <td>zeliha.ozdogan</td>
                            </tr><tr> 
                                <td>39</td> 
                                <td>zeynel.koc</td>
                            </tr></tbody></table></div>
            </div>

            <ul class="detail_wrapper">

            </ul>





        </div>

        <script>



            var settings;
            $().ready(function() {
                settings = new Settings($('body'));
                settings.initialize();
            });



        </script>
    </body>



</html>