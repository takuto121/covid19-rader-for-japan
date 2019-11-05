import { put, takeEvery, call, all } from 'redux-saga/effects'
import { generateUid } from '../../../common/genuid'
import { select } from 'redux-saga/effects'
import { getItems, getUser } from '../selector'
import {
    updateLoadingStore,
    updateUserStore,
    updateErrorStore,
    updateEmailFirestore,
    updatePasswordFirestore,
    deleteAllDataFirestore,
    updateAppStateStore,
    updateItemsStore,
    updateUserFirestore,
    uploadImageStorage,
    updateItemFirestore,
    deleteImageStorage,
    deleteItemFirestore,
} from '../utilSaga'
import { checkErrorCode } from '../../../app/firebase/errors'
import actionCreatorFactory from 'typescript-fsa';
import {Item, Loading, LoadingState, Error, User} from '../../../types/domainTypes'

import moment from 'moment'

const actionCreator = actionCreatorFactory();

export interface CreateItemState {
    item: Item,
    urls: string[],
}

export interface UpdateItemState {
    item: Item,
    urls: string[],
}

export interface DeleteItemState {
    item: Item,
}

/*export interface ImportItemsFromTradingManagerState{
    items: Item[],
}

export interface SearchTagsState {
    searchTags: string[],
}*/

export enum ItemActions{
    CREATE_ITEM_ACTION = "CREATE_ITEM_ACTION",
    UPDATE_ITEM_ACTION = "UPDATE_ITEM_ACTION",
    DELETE_ITEM_ACTION = "DELETE_ITEM_ACTION",
}

export const itemActions = {
    createItemAction: actionCreator<CreateItemState>('CREATE_ITEM_ACTION'),
    updateItemAction: actionCreator<UpdateItemState>('UPDATE_ITEM_ACTION'),
    deleteItemAction: actionCreator<DeleteItemState>('DELETE_ITEM_ACTION'),
    //downloadItemImageRequest: actionCreator('DOWNLOAD_ITEM_IMAGE_REQUEST'),
    //updateSearchTagsRequest: actionCreator<SearchTagsState>('UPDATE_SEARCH_TAGS_REQUEST'),
};


function* handleCreateItem(action: ReturnType<typeof itemActions.createItemAction>) {
    try {
        const { item, urls } = action.payload

        // loading true
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.CREATE_ITEM
        }
        yield updateLoadingStore(loading)

        // userId itemId
        const user: User = yield select(getUser)
        const userId = user.ID
        const itemId = parseInt(moment(item.StartDate).valueOf().toString() + generateUid())

        // create to storage
        const images: Item["Images"] = yield uploadImageStorage( item.Images, userId, itemId)

        // modified item
        item.Images = images
        item.ID = itemId

        // create to firestore
        yield updateItemFirestore(item, userId)

        // regist to store
        const items = yield select(getItems)
        items.push(item)
        yield updateItemsStore(items)

        // loading false
        loading.IsLoading = false
        yield updateLoadingStore(loading)
    } catch ({ code, message }) {
        // error
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.CREATE_ITEM
        }
        yield updateLoadingStore(loading)

        const errorMessage = checkErrorCode(code)
        let error = <Error>{
            IsError: true,
            Status: errorMessage,
        }
        yield updateErrorStore(error)
        console.log('Create Item error... \n', code)
    }
}

function* handleUpdateItem(action: ReturnType<typeof itemActions.updateItemAction>) {
    try {
        const { item, urls } = action.payload

        // loading true
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.UPDATE_ITEM
        }
        yield updateLoadingStore(loading)
        // modified item
        const user: User = yield select(getUser)
        const userId = user.ID
        const itemId = item.ID

        // update to firestore
        const { imagePaths, imageSizes } = yield uploadImageStorage( item.Images, userId, itemId)

        // modified item
        // modified item
        let images: Item["Images"] = []
        imagePaths.forEach((url: string, index: number) => {
            images.push({
                url: url,
                size: imageSizes[index]
            })
        });
        item.Images = images

        // update item to firebase
        yield updateItemFirestore(item, userId)

        // update items to state
        const items = yield select(getItems)
        items.map((value: Item, index: number) => {
            if (value.ID === itemId) {
                items.splice(index, 1, item)
            }
        })

        yield updateItemsStore(items)

        // loading false
        loading.IsLoading = false
        yield updateLoadingStore(loading)
    } catch ({ code, message }) {
        // error
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.UPDATE_ITEM
        }
        yield updateLoadingStore(loading)

        const errorMessage = checkErrorCode(code)
        let error = <Error>{
            IsError: true,
            Status: errorMessage,
        }
        yield updateErrorStore(error)
        console.log('Update Item error... \n', code)
    }
}

function* handleDeleteItem(action: ReturnType<typeof itemActions.deleteItemAction>) {
    try {
        const { item } = action.payload

        // loading true
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.DELETE_ITEM
        }
        yield updateLoadingStore(loading)
        // delete item from firebase
        const user: User = yield select(getUser)
        const userId = user.ID
        const itemId = item.ID
        const fileDir = '/users/' + userId + '/items/' + itemId + '/'
        yield deleteItemFirestore(fileDir)

        // delete image from firestorage
        const images = item.Images
        yield deleteImageStorage(images, fileDir)

        //update items to store
        const items = yield select(getItems)
        items.map((value: Item, index: number) => {
            if (value.ID === itemId) {
                items.splice(index, 1)
            }
        })
        yield updateItemsStore(items)

        // loading false
        loading.IsLoading = false
        yield updateLoadingStore(loading)
    } catch ({ code, message }) {
        // error
        let loading = <Loading>{
            IsLoading: true,
            LoadingState: LoadingState.DELETE_ITEM
        }
        yield updateLoadingStore(loading)

        const errorMessage = checkErrorCode(code)
        let error = <Error>{
            IsError: true,
            Status: errorMessage,
        }
        yield updateErrorStore(error)
        console.log('Delete Item error... \n', code)
    }
}

/*function* handleUpdatePassData(action) {
    try {
        const { passData } = action.payload

        // loading true
        const loadingStatus = "UPDATE_PASS_DATA"
        yield updateLoadingState({loadingStatus: loadingStatus, isLoading: true, error: false })

        // update items state
        yield updatePassDataToStore({ passData: passData })

        // loading false
        yield updateLoadingState({loadingStatus: loadingStatus, isLoading: false, error: false })
    } catch ({ code, message }) {
        // error
        const error_message = checkErrorCode(code)
        const loadingStatus = "UPDATE_PASS_DATA"
        yield updateLoadingState({
            loadingStatus: loadingStatus,
            isLoading: false,
            error: true,
            error_message: error_message,
        })
        console.log('Update PassData error... \n', code)
    }
}*/

/*function* handleDownloadItemImageRequest(action: ReturnType<typeof itemActions.downloadItemImageRequest>) {
    try {
        const { passData } = action.payload
        const { item } = passData
        const { imagePaths } = item

        // loading true
        const loadingStatus = "DOWNLOAD_ITEM_IMAGE"
        yield updateLoadingState({loadingStatus: loadingStatus, isLoading: true, error: false })

        //download item image from storage
        const images = yield downloadImageFromStorage({
            imagePaths: imagePaths,
        })

        // update items state
        item.images = images
        passData.item = item
        console.log('passdata', passData)
        yield updatePassDataToStore({ passData: passData })

        // loading false
        yield updateLoadingState({loadingStatus: loadingStatus, isLoading: false, error: false })
    } catch ({ code, message }) {
        // error
        const error_message = checkErrorCode(code)
        const loadingStatus = "DOWNLOAD_ITEM_IMAGE"
        yield updateLoadingState({
            loadingStatus: loadingStatus,
            isLoading: false,
            error: true,
            error_message: error_message,
        })
        console.log('Download Item Image error... \n', code)
    }
}*/

/*function* handleUpdateSearchTags(action: ReturnType<typeof itemActions.updateSearchTagsRequest>) {
    try {
        const { searchTags } = action.payload

        // loading true
        const loadingStatus = "UPDATE_SEARCH_TAGS"
        yield updateLoadingState(<AppState>{loadingStatus: loadingStatus, isLoading: true, error: false, errorMessage: '' })

        // update items state
        yield updateSearchTagsToStore({ searchTags: searchTags })

        // loading false
        yield updateLoadingState(<AppState>{loadingStatus: loadingStatus, isLoading: false, error: false, errorMessage: '' })
    } catch ({ code, message }) {
        // error
        const errorMessage = checkErrorCode(code)
        const loadingStatus = "UPDATE_SEARCH_TAGS"
        yield updateLoadingState(<AppState>{
            loadingStatus: loadingStatus,
            isLoading: false,
            error: true,
            errorMessage: errorMessage,
        })
        console.log('Update PassData error... \n', code)
    }
}

function* handleImportItemsFromTradingManagerRequest(action: ReturnType<typeof itemActions.importItemsFromTradingManagerRequest>) {
    try {
        const { items } = action.payload

        // loading true
        const loadingStatus = "IMPORT_ITEM_FROM_TRADING_MANAGER"
        yield updateLoadingState(<AppState>{loadingStatus: loadingStatus, isLoading: true, error: false, errorMessage: '' })

const userData = yield select(getUserData)
        const userId = userData.userId
        // create items to firebase
        yield createItemsToFirestore({
            userId: userId,
            items: items,
        })

        // regist items to state
        const storeItems = yield select(getItems)
        const newItems =  storeItems.concat(items)
        yield updateItemsToStore(newItems)
        

        // loading false
        yield updateLoadingState(<AppState>{loadingStatus: loadingStatus, isLoading: false, error: false, errorMessage: '' })
    } catch ({ code, message }) {
        // error
        const errorMessage = checkErrorCode(code)
        const loadingStatus = "IMPORT_ITEM_FROM_TRADING_MANAGER"
        yield updateLoadingState(<AppState>{
            loadingStatus: loadingStatus,
            isLoading: false,
            error: true,
            errorMessage: errorMessage,
        })
        console.log('import items from trading manager error... \n', code)
    }
}*/

function* itemSaga() {
    yield takeEvery(ItemActions.CREATE_ITEM_ACTION, handleCreateItem)
    yield takeEvery(ItemActions.UPDATE_ITEM_ACTION, handleUpdateItem)
    yield takeEvery(ItemActions.DELETE_ITEM_ACTION, handleDeleteItem)
    //yield takeEvery(itemActions.updateSearchTagsRequest.toString(), handleUpdateSearchTags)
    /*yield takeEvery(
        itemActions.downloadItemImageRequest.toString(),
        handleDownloadItemImageRequest
    )*/
    /*yield takeEvery(
        itemActions.importItemsFromTradingManagerRequest.toString(),
        handleImportItemsFromTradingManagerRequest
    )*/
}
export default itemSaga