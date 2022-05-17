[@scent/proxies](../README.md) / [Modules](../modules.md) / reactive

# Module: reactive

## Table of contents

### Classes

- [Subscriber](../classes/reactive.Subscriber.md)

### Functions

- [\_getMaps](reactive.md#_getmaps)
- [computed](reactive.md#computed)
- [getOrigin](reactive.md#getorigin)
- [getReact](reactive.md#getreact)
- [getRefProperty](reactive.md#getrefproperty)
- [getRefValue](reactive.md#getrefvalue)
- [isReactive](reactive.md#isreactive)
- [isRef](reactive.md#isref)
- [linkRef](reactive.md#linkref)
- [react](reactive.md#react)
- [ref](reactive.md#ref)
- [subscribe](reactive.md#subscribe)

## Functions

### \_getMaps

▸ **_getMaps**(): `WeakMap`<`object`, `any`\>[]

#### Returns

`WeakMap`<`object`, `any`\>[]

#### Defined in

[reactive.ts:84](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L84)

___

### computed

▸ **computed**(`options`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`any`

#### Defined in

[reactive.ts:230](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L230)

___

### getOrigin

▸ **getOrigin**(`obj`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`any`

#### Defined in

[reactive.ts:278](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L278)

___

### getReact

▸ **getReact**(`obj`, `isShallow?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `obj` | `any` | `undefined` |
| `isShallow` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[reactive.ts:282](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L282)

___

### getRefProperty

▸ **getRefProperty**(`obj`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`any`

#### Defined in

[reactive.ts:219](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L219)

___

### getRefValue

▸ **getRefValue**(`obj`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`any`

#### Defined in

[reactive.ts:226](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L226)

___

### isReactive

▸ **isReactive**(`obj`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`boolean`

#### Defined in

[reactive.ts:274](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L274)

___

### isRef

▸ **isRef**(`obj`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`boolean`

#### Defined in

[reactive.ts:215](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L215)

___

### linkRef

▸ **linkRef**(`obj`, `property`, `ref`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |
| `property` | `any` |
| `ref` | `any` |

#### Returns

`void`

#### Defined in

[reactive.ts:177](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L177)

___

### react

▸ **react**(`origin`, `isShallow?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `origin` | `any` | `undefined` |
| `isShallow` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[reactive.ts:204](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L204)

___

### ref

▸ **ref**(`value`, `property?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `any` | `undefined` |
| `property` | `string` | `'value'` |

#### Returns

`any`

#### Defined in

[reactive.ts:208](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L208)

___

### subscribe

▸ **subscribe**(`obj`, ...`args`): [`Subscriber`](../classes/reactive.Subscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |
| `...args` | `any`[] |

#### Returns

[`Subscriber`](../classes/reactive.Subscriber.md)

#### Defined in

[reactive.ts:297](https://github.com/canguser/scent-proxies/blob/4304a92/main/reactive.ts#L297)
