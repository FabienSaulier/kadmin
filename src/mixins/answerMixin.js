
// Mixin object
import axios from 'axios'
import * as Toaster from '../lib/toaster'

export default {
  data() {
    return {
    }
  },
  methods: {
    save: async function (answer) {
      const cleanAnswer = JSON.parse(JSON.stringify(answer))
      try {
        await axios({ method: 'put', url: process.env.API_URL+'/answer/', data: cleanAnswer })
        this.$toasted.success(cleanAnswer.name+' enregistré', Toaster.options)
        this.clearChildForm()
        this.load()
        return true
      } catch (e) {
        const errMsg = e.response.data.message
        this.$toasted.error(errMsg, Toaster.options)
        return false
      }
    },

    deleteAnswer: function (id, name) {
      if (!window.confirm('Voulez vous supprimer '+name)) return
      const url = process.env.API_URL+'/answer/'+id
      axios.delete(url)
        .then(() => {
          this.$toasted.success('Réponse supprimée', Toaster.options)
          this.load()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    addChild: function (answer) {
      const childLink = {
        _id: this.child._id,
        name: this.child.label,
        label: this.childLabel,
      }
      if (this.payloadKey !== undefined && this.payloadKey !== '') {
        // eslint-disable-next-line
        _.set(childLink, 'payload_data', { key: this.payloadKey, value: this.payloadValue })
      }

      if (childLink.name === undefined) {
        childLink.name = this.child.name
      }
      answer.children.push(childLink)
      this.child = ''
      this.childLabel = ''
      this.payloadKey = undefined
      this.payloadValue = undefined
    },

    addSibling: function (answer) {
      // siblingName est un object {name, label}
      const sibling = this.items.filter(a => a.name === this.siblingName.name)
      const siblingLink = { _id: sibling[0]._id, name: this.siblingName.name, label: this.siblingLabel }
      if (!siblingLink.label || siblingLink.label === '') {
        this.$toasted.error('un label est nécessaire pour la quick reply', Toaster.options)
        return
      }
      answer.siblings.push(siblingLink)
      this.siblingName = ''
      this.siblingLabel = ''
    },

    delChild: function (answer, child) {
      if (!window.confirm('Voulez vous supprimer le fils: '+child.name+' - '+child.label)) return
      answer.children = answer.children.filter(c => c.label !== child.label)
    },

    delSibling: function (answer, sibling) {
      if (!window.confirm('Voulez vous supprimer le sibling: '+sibling.name)) return
      answer.siblings = answer.siblings.filter(c => c.name !== sibling.name && c.label !== sibling.label)
    },
  },
}
