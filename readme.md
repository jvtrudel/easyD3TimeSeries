# easyD3TimeSeries

Utilitaire «responsive» de visualisation de séries temporelles en Javascript basé sur la librairie D3.

## Objectifs

  - Fournir un gabarit de graphe pour les séries temporelles.
  - Fournir une solution responsive facile à utiliser.
  - Se limite aux «line Chart»

## Prérequis

  - d3
  - jQuery   (dépendance à éliminer)
  
## Exemple d'utilisation

Ajouter les dépendances et les feuilles de styles dans <head>.

    <link rel="stylesheet" type="text/css" href="src/eDTS.css">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script type="text/javascript" src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script type="text/javascript" src="src/eDTS.js" ></script>

Dans body, insérer un élément auquel fixer le graphe (présentement les dimensions de la figure sont déterminés par les dimensions de cet élément... attention à style.css).

    <div id="myPlot"></div>

Insérer les données via un \<script\>.

    timeFormat="%Y-%m";
    data=[["2015-01",4],["2015-03",8],["2015-08",6],["2016-12",10]];
    eDTS.bind("myPlot").setData(data,timeFormat).init();
     
