<template>
  <form action="" role="search" novalidate="" class="ais-SearchBox-form">
    <input
      type="search"
      :value="query"
      @input="onInput"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
      required=""
      maxlength="512"
      aria-label="Search"
      placeholder="Search here…"
      class="ais-SearchBox-input"
    />
    <button type="submit" title="Search" class="ais-SearchBox-submit">
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 40 40"
        class="ais-SearchBox-submitIcon"
      >
        <path
          d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
    <button type="reset" title="Clear" class="ais-SearchBox-reset" hidden="">
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 20 20"
        class="ais-SearchBox-resetIcon"
      >
        <path
          d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
  </form>
</template>

<script>
import { connectSearchBox } from "instantsearch.js/es/connectors";
import { createWidgetMixin } from "vue-instantsearch/vue3/es";

export default {
  mixins: [createWidgetMixin({ connector: connectSearchBox })],
  props: {
    delay: {
      type: Number,
      default: 200,
      required: false,
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timerId: null,
      localQuery: this.modelValue,
    };
  },
  watch: {
    modelValue(newVal) {
      this.localQuery = newVal;
    }
  },
  unmounted() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  },
  methods: {
    onInput(event) {
      const newValue = event.target.value;
      this.localQuery = newValue;
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(() => {
        this.state.refine(newValue);
        this.$emit('update:modelValue', newValue);
      }, this.delay);
    }
  },
  computed: {
    query() {
      return this.localQuery;
    }
  }
};
</script>