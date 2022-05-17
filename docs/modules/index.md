[@scent/proxies](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [Subscriber](index.md#subscriber)
- [\_getMaps](index.md#_getmaps)
- [computed](index.md#computed)
- [getOrigin](index.md#getorigin)
- [getReact](index.md#getreact)
- [getRefProperty](index.md#getrefproperty)
- [getRefValue](index.md#getrefvalue)
- [isReactive](index.md#isreactive)
- [isRef](index.md#isref)
- [linkRef](index.md#linkref)
- [react](index.md#react)
- [ref](index.md#ref)
- [subscribe](index.md#subscribe)

### Functions

- [get](index.md#get)
- [has](index.md#has)
- [parseChain](index.md#parsechain)
- [set](index.md#set)

## References

### Subscriber

Re-exports: [Subscriber](../classes/reactive.Subscriber.md)

___

### \_getMaps

Re-exports: [\_getMaps](reactive.md#_getmaps)

___

### computed

Re-exports: [computed](reactive.md#computed)

___

### getOrigin

Re-exports: [getOrigin](reactive.md#getorigin)

___

### getReact

Re-exports: [getReact](reactive.md#getreact)

___

### getRefProperty

Re-exports: [getRefProperty](reactive.md#getrefproperty)

___

### getRefValue

Re-exports: [getRefValue](reactive.md#getrefvalue)

___

### isReactive

Re-exports: [isReactive](reactive.md#isreactive)

___

### isRef

Re-exports: [isRef](reactive.md#isref)

___

### linkRef

Re-exports: [linkRef](reactive.md#linkref)

___

### react

Re-exports: [react](reactive.md#react)

___

### ref

Re-exports: [ref](reactive.md#ref)

___

### subscribe

Re-exports: [subscribe](reactive.md#subscribe)

## Functions

### get

▸ **get**(`target`, `propertyChain`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyChain` | `any` |

#### Returns

`any`

#### Defined in

[utils/property-chain.ts:12](https://github.com/canguser/scent-proxies/blob/4304a92/main/utils/property-chain.ts#L12)

___

### has

▸ **has**(`target`, `propertyChain`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyChain` | `any` |

#### Returns

`void`

#### Defined in

[utils/property-chain.ts:48](https://github.com/canguser/scent-proxies/blob/4304a92/main/utils/property-chain.ts#L48)

___

### parseChain

▸ **parseChain**(`chain`): (`string` \| `symbol`)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `any` |

#### Returns

(`string` \| `symbol`)[]

#### Defined in

[utils/property-chain.ts:1](https://github.com/canguser/scent-proxies/blob/4304a92/main/utils/property-chain.ts#L1)

___

### set

▸ **set**(`target`, `propertyChain`, `value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyChain` | `any` |
| `value` | `any` |

#### Returns

`any`

#### Defined in

[utils/property-chain.ts:28](https://github.com/canguser/scent-proxies/blob/4304a92/main/utils/property-chain.ts#L28)
