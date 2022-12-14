import classNames from "classnames"
import React, { FunctionComponentElement, useContext, useState } from "react"
import { MenuContext } from "./menu"
import { MenuItemProps } from "./menuItem"
import Icon from "../Icon"
import { CSSTransition } from "react-transition-group"
import Transition from "../Transition"
export interface SubMenuProps {
	index?: string,
	title: string,
	className?: string,
	children?:React.ReactNode
}

const SubMenu: React.FC<SubMenuProps> = ({ index, title, children, className }) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const context = useContext(MenuContext)
	const opendSubmenus = context.defaultOpenSubMenus as Array<string>
	const menuOpen = (index && context.mode === 'vertical') ? opendSubmenus.includes(index) : false
	const [isOpen, setOpen] = useState(menuOpen)
	const classes = classNames('submenu-item', className, {
		'is-active': context.index === index,
		'is-open':isOpen,
		'is-vertical':context.mode === 'vertical'
	})
	const onClick = () => {
		setOpen(!isOpen)
	}
	let timer: any;
	const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
		clearTimeout(timer)
		e.preventDefault()
		timer = setTimeout(() => {
			setOpen(toggle)
		},300)
	}

	const clickEvents = context.mode === 'vertical' ? {
		onClick:onClick
	} : {}
	const hoverEvents = context.mode !== 'vertical' ? {
		onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
		onMouseLeave:(e: React.MouseEvent) => { handleMouse(e, false) }
	} :{}
	const renderChildren = () => {
		const submenuClasses = classNames('xc-submenu')
		const childComponent = React.Children.map(children, (child, i) => {
			const childElement = child as FunctionComponentElement<MenuItemProps>
			if (childElement.type.displayName === 'menu-item') {
				return React.cloneElement(childElement, {
					index:`${index}-${i}`
				})
			} else {
				console.error('warning: submenu has child with not a react component')
			}
		})

		return (
			<Transition in={isOpen} timeout={300} animation="zoom-in-top">
				<ul className={submenuClasses}>{childComponent}</ul>
			</Transition>
		)
	}
	return (
		<li key={index} className={classes} {...hoverEvents}>
			<div className="menu-item submenu-title" onClick={onClick} {...clickEvents}>
				{title}
				<Icon icon='angle-down'/>
			</div>
			{renderChildren()}
		</li>
	)
}

SubMenu.displayName = 'sub-menu'
export default SubMenu