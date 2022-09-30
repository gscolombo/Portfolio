<script>
import LoadingModal from './LoadingModal.vue';
import DropField from './DropField.vue';
import helpers from './helpers.js';
const {
  setTextareaHeight,
  updateTextareaHeight,
  checkForEmptyFields,
  checkForInvalidURLs,
} = helpers;

export default {
  props: {
    work: Object,
  },
  emits: ['updateGrid', 'closePanel'],
  inject: ['newWork'],
  mounted() {
    console.log(this.work);
    setTextareaHeight(this.$refs.textarea);
  },
  updated() {
    updateTextareaHeight(this.$refs.textarea);
  },
  data() {
    return {
      refWork: { ...this.work },
      loading: false,
      loadingMessage: 'Salvando projeto...',

      // Form input monitoring and validation reactive properties
      changes: [],
      noEmptyFields: checkForEmptyFields(Object.values(this.work)),
      allValidURLs: checkForInvalidURLs(Object.keys(this.work), this.work),
    };
  },
  // Watch changes in work object
  watch: {
    work: {
      handler() {
        this.changes = [];
        for (const key in { ...this.refWork }) {
          if (this.refWork[key] != this.work[key]) {
            this.changes.push(key);
          }
        }
        this.noEmptyFields = checkForEmptyFields(Object.values(this.work));
        this.allValidURLs = checkForInvalidURLs(
          Object.keys(this.work),
          this.work
        );
      },
      deep: true,
    },
  },
  methods: {
    // Save/update work
    async saveChanges(event) {
      const hasChanges = this.changes.length;
      const id = event.composedPath()[2].id;

      if (hasChanges && this.noEmptyFields && this.allValidURLs) {
        this.loading = true;
        const bodyEntries = this.changes.map((field) => {
          return [field, this.work[field]];
        });
        const body = Object.fromEntries(bodyEntries);

        const query = `?_id=${id}`;
        const url =
          location.origin +
          `/.netlify/functions/db/works${this.newWork ? '' : query}`;

        const params = {
          headers: {
            'Content-Type': 'application/json',
          },
          method: this.newWork ? 'POST' : 'PATCH',
          body: JSON.stringify(body),
        };

        try {
          const res = await fetch(url, params);
          const json = await res.json();

          const responseWork = this.newWork
            ? { _id: json.id, ...body }
            : json.updatedDocument;

          this.$emit('updateGrid', responseWork, params.method);
        } catch (err) {
          alert(`Erro ao salvar projeto! \n Erro: ${err}`);
        }

        this.$emit('closePanel', this.$refs);
        this.loading = false;
      }
    },
    // Delete work
    async deleteProject(event) {
      const id = event.path[2].id;
      const url = location.origin + `/.netlify/functions/db/works?_id=${id}`;

      this.loading = true;
      this.loadingMessage = 'Apagando projeto...';

      const res = await fetch(url, { method: 'DELETE' });
      const remainingWorks = (await res.json()).remainingDocuments;
      this.loading = false;

      this.$emit('updateGrid', remainingWorks, 'DELETE');
      this.$emit('closePanel', this.$refs);
    },
  },
  components: { LoadingModal, DropField },
};
</script>

<template>
  <div class="work-panel-container" ref="panel">
    <div class="work-panel" :id="work._id">
      <img
        @click="$emit('closePanel', this.$refs)"
        class="cross"
        src="img/cross.svg"
      />
      <DropField :work="work" />
      <input
        name="title"
        type="text"
        v-model="work.title"
        placeholder="Insira aqui o título do projeto"
        :class="{ edited: this.changes.includes('title') }"
      />
      <textarea
        ref="textarea"
        name="description"
        v-model.trim="work.description"
        placeholder="Descreva o projeto aqui"
        :class="{ edited: this.changes.includes('description') }"
        >{{ work.description }}</textarea
      >

      <p>
        <strong>Link do site: </strong>
        <input
          type="url"
          name="iframeLink"
          v-model="work.iframeLink"
          placeholder="Insira aqui o link para o site do projeto"
          :class="{ edited: this.changes.includes('iframeLink') }"
        />
      </p>
      <p>
        <strong>Link do repositório: </strong>
        <input
          type="url"
          name="repoLink"
          v-model="work.repoLink"
          placeholder="Insira aqui o link para o repositório do projeto"
          :class="{ edited: this.changes.includes('repoLink') }"
        />
      </p>
      <div class="buttonWrapper">
        <button
          :class="{
            inactive:
              !this.changes.length || !this.noEmptyFields || !this.allValidURLs,
          }"
          @click="saveChanges"
          type="button"
        >
          {{ this.newWork ? 'Salvar projeto' : 'Salvar alterações' }}
        </button>
        <button v-show="!newWork" @click="deleteProject" type="button">
          Apagar projeto
        </button>
      </div>
    </div>
    <LoadingModal v-if="loading" :message="loadingMessage" />
  </div>
</template>

<style lang="scss">
@keyframes openPanel {
  from {
    clip-path: inset(0 50% 0 50%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes closePanel {
  to {
    clip-path: inset(0 50% 0 50%);
  }
  from {
    clip-path: inset(0 0 0 0);
  }
}

.work-panel-container {
  width: 100vw;
  height: 100vh;
  background-color: #000000aa;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: all 0.25s 0.25s;
  &.closing {
    background-color: transparent;
    backdrop-filter: blur(0px);
    .work-panel {
      animation: closePanel 0.25s ease-in-out forwards;
    }
  }
  .work-panel {
    width: 50%;
    min-width: 720px;
    max-height: 90%;
    margin: 0 auto;
    border: 2px solid $red;
    border-radius: 5px;
    padding: 20px;
    position: relative;
    background: unquote($cblack + '99');
    display: flex;
    flex-direction: column;
    animation: openPanel 0.25s ease-in-out;
    input,
    textarea {
      @include typo(16, $cwhite + AA, 'sec');
      margin-top: 20px;
      padding: 0;
      padding-bottom: 10px;
      border: none;
      background: none;
      outline: none;
      resize: none;
      overflow-y: hidden;
      transition: all 0.25s;
      &.edited,
      &:focus {
        color: $cwhite;
      }
    }
    input[name='title'] {
      font-size: calc(24 / 16) + rem;
      border-bottom: 1px solid $red;
      text-align: center;
    }
    p {
      @include typo(16, $cwhite, 'sec');
      min-width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      input {
        margin-top: 0;
        padding-bottom: 0;
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      strong {
        font-weight: 600;
      }
    }
    .buttonWrapper {
      display: flex;
      justify-content: space-around;
      button {
        @include button(24);
        max-width: 50%;
        margin: 20px auto 0 auto;
        padding: 6px 20px;
        transition: all 0.25s;
        &.inactive {
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }

    img.cross {
      align-self: flex-end;
      margin: -8px -8px 0 0;
      padding: 0px 0px 8px 8px;
      box-sizing: content-box;
      min-width: 20px;
      cursor: pointer;
    }
  }
}
</style>
