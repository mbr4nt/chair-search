<template>
  <header class="header">
    <img src="../assets/logo.png" />
    <h1 class="header-title">Seating Search</h1>
    <p class="header-subtitle">A smarter way to find chairs</p>
  </header>
  <div class="container">
    <ais-instant-search :search-client="searchClient" :index-name="indexName" :routing="routing">
      <div class="search-panel__filters">
        <h2>Category</h2>
        <ais-refinement-list attribute="categories" />
        <h2>Series</h2>
        <ais-refinement-list attribute="series" limit="5" show-more="true" show-more-limit="500" />
        <h2>Arm Type</h2>
        <ais-refinement-list attribute="armType" />
        <h2>Base Type</h2>
        <ais-refinement-list attribute="baseType" limit="5" show-more="true" show-more-limit="500" />
        <h2>Back Material</h2>
        <ais-refinement-list attribute="backMaterial" />
        <h2>Back Height</h2>
        <ais-refinement-list attribute="backHeight" />
        <h2>Tilter Prop</h2>
        <ais-refinement-list attribute="tilterProp" />
        <h2>Price</h2>
        <ais-numeric-menu
          attribute="price"
          :items="[
            { label: 'All' },
            { label: '<= 1000$', end: 1000 },
            { label: '1000$ - 2000$', start: 1000, end: 2000 },
            { label: '2000$ - 5000$', start: 2000, end: 5000 },
            { label: '>= 5000$', start: 5000 },
          ]"
        />
      </div>
      <div class="search-panel__results">
        <app-debounced-search-box v-model="searchQuery" :delay="10" class="ais-SearchBox-input" />
        <ais-hits>
          <template v-slot:item="{ item }">
            <div @click="itemClicked(item)">
              <div class="hit-name">
                <ais-highlight :hit="item" attribute="partNumber" />
              </div>
              <img :src="item.image" align="left" :alt="item.image" />
              <div class="hit-description">
                <ais-snippet :hit="item" attribute="name" />
              </div>
              <div class="hit-info">series: {{ item.series }}</div>
              <div class="hit-info">price: {{ formatCurrency(item.price) }}</div>
              <div class="hit-info">catalogue: {{ item.catalogue }}</div>
            </div>
          </template>
        </ais-hits>
        <ais-configure
          :attributesToSnippet="['name:50']"
          snippetEllipsisText="…"
        />
      </div>
      <ais-pagination />
    </ais-instant-search>
  </div>
</template>

<script>
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import AppDebouncedSearchBox from "../DebouncedSearchBox";
import { history } from 'instantsearch.js/es/lib/routers';

export default {
  components: {
    AppDebouncedSearchBox,
  },
  methods: {
    itemClicked(item) {
      let cmInfo = item.cmInfo;
      let partNumber = item.partNumber;
      let catalogue = item.catalogue;

      let pn = cmInfo?.partNumber ?? partNumber;
      let pkg = cmInfo?.package ? cmInfo.package + '/' : "";
      let className = cmInfo?.className ? cmInfo.className + '/' : "";
      let result = (pkg || className) ? pkg + className + pn : catalogue + "/" + pn;
      let query = window.location.search ? '/' + window.location.search : '';
      
      console.log("Item clicked: " + result);
      let cetCall = 'cet://insert-chair.custom.global/';
      console.log(cetCall + result + query);
      
      window.chrome.webview.postMessage(cetCall + result + query);
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(value);
    }
  },
  data() {
    const query = new URLSearchParams(window.location.search).get('query') || '';
    return {
      searchQuery: decodeURIComponent(query),
      searchClient: instantMeiliSearch(
        process.env.VUE_APP_MEILISEARCH_HOST,
        process.env.VUE_APP_MEILISEARCH_API_KEY,
        {
          finitePagination: true,
        }
      ).searchClient,
      indexName: "cad",
      routing: {
          router: history({
            createURL({ qsModule, routeState, location }) {
              const urlParts = location.href.match(/^(.*?)\/cad/);
              const baseUrl = `${urlParts ? urlParts[0] : ''}`;
              const queryParameters = {};
              
              if (routeState.query) {
                queryParameters.query = encodeURIComponent(routeState.query);
              }
              if (routeState.page !== 1) {
                queryParameters.page = routeState.page;
              }
              if (routeState.categories) {
                queryParameters.categories = routeState.categories.map(encodeURIComponent);
              }
              if (routeState.series) {
                queryParameters.series = routeState.series.map(encodeURIComponent);
              }
              if (routeState.armType) {
                queryParameters.armType = routeState.armType.map(encodeURIComponent);
              }
              if (routeState.baseType) {
                queryParameters.baseType = routeState.baseType.map(encodeURIComponent);
              }
              if (routeState.backMaterial) {
                queryParameters.backMaterial = routeState.backMaterial.map(encodeURIComponent);
              }
              if (routeState.backHeight) {
                queryParameters.backHeight = routeState.backHeight.map(encodeURIComponent);
              }
              if (routeState.tilterProp) {
                queryParameters.tilterProp = routeState.tilterProp.map(encodeURIComponent);
              }
              if (routeState.price) {
                queryParameters.price = routeState.price;
              }

              const queryString = qsModule.stringify(queryParameters, {
                addQueryPrefix: true,
                arrayFormat: 'repeat',
              });
              return `${baseUrl}${queryString}`;
            },

            parseURL({ qsModule, location }) {
              const { query = '', page, categories = [], series = [], 
                      armType = [], baseType = [], backMaterial = [], 
                      backHeight = [], tilterProp = [], price } 
                  = qsModule.parse(location.search.slice(1));
                  
              // `qs` does not return an array when there's a single value.
              const allCategories = Array.isArray(categories)
                ? categories
                : [categories].filter(Boolean);

              const allSeries = Array.isArray(series)
                ? series
                : [series].filter(Boolean);

              const allArmType = Array.isArray(armType)
                ? armType
                : [armType].filter(Boolean);

              const allBaseType = Array.isArray(baseType)
                ? baseType
                : [baseType].filter(Boolean);

              const allBackMaterial = Array.isArray(backMaterial)
                ? backMaterial
                : [backMaterial].filter(Boolean);

              const allBackHeight = Array.isArray(backHeight)
                ? backHeight
                : [backHeight].filter(Boolean);

              const allTilterProp = Array.isArray(tilterProp)
                ? tilterProp
                : [tilterProp].filter(Boolean);
              
              return {
                query: decodeURIComponent(query),
                page,
                categories: allCategories.map(decodeURIComponent),
                series: allSeries.map(decodeURIComponent),
                armType: allArmType.map(decodeURIComponent),
                baseType: allBaseType.map(decodeURIComponent),
                backMaterial: allBackMaterial.map(decodeURIComponent),
                backHeight: allBackHeight.map(decodeURIComponent),
                tilterProp: allTilterProp.map(decodeURIComponent),
                price,
              };
            },
          }),
          stateMapping: {
            stateToRoute(uiState) {
              const indexUiState = uiState.cad || {};
              return {
                query: indexUiState.query,
                page: indexUiState.page,
                categories:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.categories,
                series:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.series,
                armType:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.armType,
                baseType:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.baseType,
                backMaterial:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.backMaterial,
                backHeight:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.backHeight,
                tilterProp:
                  indexUiState.refinementList &&
                  indexUiState.refinementList.tilterProp,
                price:
                  indexUiState.numericMenu &&
                  indexUiState.numericMenu.price,
              };
            },
            routeToState(routeState) {
              var data = {
                cad: {
                  query: routeState.query,
                  page: routeState.page,
                  refinementList: {
                    categories: routeState.categories,
                    series: routeState.series,
                    armType: routeState.armType,
                    baseType: routeState.baseType,
                    backMaterial: routeState.backMaterial,
                    backHeight: routeState.backHeight,
                    tilterProp: routeState.tilterProp
                  },
                  numericMenu: {
                    price: routeState.price
                  }
                },
              };
              return data;
            }
          },
        },
    };
  },
  watch: {
    searchQuery(newQuery) {
      this.$router.push({ query: { ...this.$route.query, query: newQuery } });
    }
  }
};

</script>
<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.ais-Hits-item {
  margin-bottom: 1em;
  width: calc(25% - 1rem);
}

.ais-Hits-item img {
  margin-right: 1em;
  width: 100%;
  height: 100%;
  margin-bottom: 0.5em;
}

.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}

.disclaimer {
  margin-left: 1em;
}

.hit-name {
  margin-bottom: 0.5em;
}

.hit-info {
  font-size: 90%;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #fff, #33a7d9);
  color: #333;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
  padding-left: 10px !important;
}

.hit-description {
  font-size: 90%;
  margin-bottom: 0.5em;
  color: grey;
}

.header-title::after {
  content: " ▸ ";
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  padding: 1rem;
}

.ais-InstantSearch {
  max-width: 960px;
  overflow: hidden;
  margin: 0;
}

.search-panel__filters {
  float: left;
  width: 200px;
}

.search-panel__results {
  margin-left: 210px;
}

.ais-SearchBox {
  margin-bottom: 2rem;
}

.ais-Pagination {
  margin: 2rem auto;
  text-align: center;
}
.ais-SearchBox-form {
  margin-bottom: 20px;
}
</style>
