<template>
  <div class="w-full">
    <form
      id="form-user"
      class="grid grid-cols-12 gap-3 w-full text-pvsm"
      @submit.prevent="edit ? updateUser() : addUser()"
    >
      <!-- Linha1 -->
      <div class="col-start-1 col-end-8 w-full">
        <label for="nome">Nome Completo*</label>
        <input
          v-model="form.nome"
          class="w-full p-1 rounded border-2 border-divider"
          type="text"
          name="nome"
          required
        />
      </div>
      <div class="col-start-8 lg:col-end-11  col-end-13">
        <label for="cpf">CPF*</label>
        <input
          v-model="form.cpf"
          v-mask="'###.###.###-##'"
          class="w-full p-1 rounded border-2 border-divider"
          type="text"
          name="cpf"
          placeholder="000.000.000-00"
          required
        />
        <p v-if="errors.cpf" class="text-red-600">{{ errors.cpf }}</p>
      </div>
      <div class="lg:col-start-11 lg:col-end-13 col-start-1 col-end-7">
        <label for="dtNasc">Data de Nascimento*</label>
        <input
          v-model="form.dtNasc"
          class="w-full p-1 rounded border-2 border-divider"
          type="date"
          name="dtNasc"
          required
        />
      </div>
      <!-- Linha2 -->
      <div class="lg:col-start-1 lg:col-end-6 col-start-7 col-end-13">
        <label for="estado">Estado*</label>
        <select
          v-model="form.estado"
          class="w-full p-1.5 rounded border-2 border-divider"
          name="estado"
          required
          @change="fetchCidades(form.estado)"
        >
          <option value="" selected disabled>Selecione</option>
          <option
            v-for="(estado, i) in estados"
            :key="'estado' + i"
            :value="estado.id"
          >
            {{ estado.nome }}
          </option>
        </select>
      </div>
      <div class="lg:col-start-6 lg:col-end-11 col-start-1 col-end-7">
        <label for="cidade">Cidade*</label>
        <select
          v-model="form.cidade"
          class="w-full p-1.5 rounded border-2 border-divider"
          name="cidade"
          required
        >
          <option value="" selected disabled>Selecione</option>
          <option
            v-for="(cidade, i) in cidades"
            :key="'cidade' + i"
            :value="cidade.id"
          >
            {{ cidade.nome }}
          </option>
        </select>
      </div>
      <div class="lg:col-start-11 lg:col-end-13 col-start-7 col-end-13  self-end">
        <button
          type="submit"
          class="w-full p-1 rounded border-2 border-btn bg-btn text-white hover:bg-btnh"
        >
          <span class="flex items-center justify-center gap-1.5"
            ><img src="~/static/icon-arrow.svg" />{{
              edit ? 'EDITAR' : 'INCLUIR'
            }}</span
          >
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: ['usersList'],
  data() {
    return {
      form: {
        id: '',
        nome: '',
        cpf: '',
        dtNasc: '',
        estado: '',
        cidade: '',
      },
      cidades: [],
      estados: [],
      errors: {
        cpf: '',
      },
      edit: false,
      urlEstados: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    };
  },
  async fetch() {
    this.estados = await this.$axios.$get(this.urlEstados);
  },
  computed: {
    users() { return this.usersList; },
  },
  mounted() {
    this.$root.$on('edit', async (data) => await this.editUser(data));
  },
  methods: {
    async fetchCidades(estado) {
      const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`;
      const cidades = await this.$axios.$get(url);
      this.cidades = cidades;
    },

    addUser() {
      this.errors.cpf = '';
      if (!this.validaCpf(this.form.cpf)) {
        this.errors.cpf = 'CPF inválido';
        return;
      }
      const user = {
        nome: this.form.nome,
        cpf: this.form.cpf,
        dtNasc: this.formataData(this.form.dtNasc),
        idade: this.calculaIdade(this.form.dtNasc),
        estado: this.estados.find((uf) => uf.id == this.form.estado).sigla,
        cidade: this.cidades.find((mun) => mun.id == this.form.cidade).nome,
      };
      this.$emit('add-user', user);
      this.limpaForm();
    },

    async editUser(idUser) {
      this.edit = true;
      const user = this.users[idUser];
      const estado = this.estados.find((uf) => uf.sigla == user.estado);
      await this.fetchCidades(estado.id);
      const cidade = this.cidades.find((mun) => mun.nome == user.cidade);
      this.form = {
        id: idUser,
        nome: user.nome,
        cpf: user.cpf,
        dtNasc: user.dtNasc.split('/').reverse().join('-'),
        estado: estado.id,
        cidade: cidade.id,
      };
    },
    updateUser() {
      this.errors.cpf = '';
      if (!this.validaCpf(this.form.cpf)) {
        this.errors.cpf = 'CPF inválido';
        return;
      }
      const user = {
        id: this.form.id,
        nome: this.form.nome,
        cpf: this.form.cpf,
        dtNasc: this.formataData(this.form.dtNasc),
        idade: this.calculaIdade(this.form.dtNasc),
        estado: this.estados.find((uf) => uf.id == this.form.estado).sigla,
        cidade: this.cidades.find((mun) => mun.id == this.form.cidade).nome,
      };
      this.$emit('update-user', user);
      this.limpaForm();
      this.edit = false;
    },

    calculaIdade(dtNasc) {
      const hoje = new Date();
      const nasc = new Date(dtNasc);
      let diffAnos = hoje.getFullYear() - nasc.getFullYear();
      if (
        new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
        new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())
      ) {
        diffAnos--;
      }

      return diffAnos;
    },

    formataData(data) {
      const date = new Date(data);
      date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
      return Intl.DateTimeFormat('pt-br').format(date);
    },

    limpaForm() {
      this.form = {
        id: '',
        nome: '',
        cpf: '',
        dtNasc: '',
        estado: '',
        cidade: '',
      };
      this.cidades = [];
    },

    validaCpf(cpf) {
      const strCPF = cpf.replace(/[^\d]+/g, '');
      let Soma;
      let Resto;
      Soma = 0;
      if (strCPF == '00000000000') {
        return false;
      }

      for (let i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
      }

      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }
      if (Resto != parseInt(strCPF.substring(9, 10))) {
        return false;
      }

      Soma = 0;
      for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
      }
      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }
      if (Resto != parseInt(strCPF.substring(10, 11))) {
        return false;
      }
      return true;
    },
  },
};
</script>

