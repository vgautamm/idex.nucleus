"use strict";

/**
 * @fileOverview Define the Nucleus Event class that is used to create an event.
 *
 * @author Sebastien Filion
 */

const NucleusError = require('./Error.nucleus');
const NucleusResource = require('./Resource.nucleus');

const nucleusValidator = require('./validator.nucleus');

const eventResourceStructure = {
  name: 'string',
  message: 'object'
};

/**
 * @module NucleusEvent
 * @typedef NucleusEvent
 * @property {String} ID
 * @property {Object} meta
 * @property {String} meta.createdISOTime
 * @property {String} meta.originEngineID
 * @property {String} meta.originEngineName
 * @property {String} meta.originProcessID
 * @property {String} name
 * @property {Object} message
 */

class NucleusEvent extends NucleusResource {

  /**
   * Creates a Nucleus Event.
   * @example
   * const event = new NucleusEvent(eventName, eventMessage, options);
   *
   * @argument {String} eventName
   * @argument {Object} eventMessage
   * @argument {Object} [options]
   * @argument {String} [options.actionID] - The ID of the action that triggered the event.
   * @argument {String} [options.correlationID]
   * @argument {String} [options.originEngineID]
   * @argument {String} [options.originEngineName]
   * @argument {String} [options.originProcessID]
   *
   * @throws Will throw an error if the event name is missing or an empty string.
   */
  constructor (eventName, eventMessage = {}, options = {}) {
    if (arguments.length === 1 && arguments[0] instanceof NucleusEvent) return arguments[0];
    else {
      if (!nucleusValidator.isString(eventName) || nucleusValidator.isEmpty(eventName)) throw new NucleusError.UndefinedValueNucleusError("The event name is mandatory.");

      const { correlationID, originEngineID = 'Unknown', originEngineName = 'Unknown', originProcessID = process.pid, originUserID = 'Unknown' } = options;
      const eventAttributes = { meta: { originEngineID, originEngineName, originProcessID }, name: eventName, message: eventMessage };

      if (!!correlationID) eventAttributes.meta.correlationID = correlationID;

      super('NucleusEvent', eventResourceStructure, eventAttributes, originUserID);

      /** @member {String} name */
      Reflect.defineProperty(this, 'name', { enumerable: true, writable: false });

      /** @member {Object} message */
      Reflect.defineProperty(this, 'message', {
        enumerable: true,
        value: Object.assign(NucleusEvent.generateAttributeProxy(), this.message),
        writable: false
      });

      /** @member {String} originUserID */
      this.originUserID = originUserID;

      Object.freeze(this.message);
    }

    Reflect.preventExtensions(this);
  }

  generateOwnItemKey () {

    return NucleusResource.generateItemKey(this.type, this.name, this.ID);
  }

}

module.exports = NucleusEvent;